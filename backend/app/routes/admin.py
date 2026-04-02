import os
import re
from collections import defaultdict
from datetime import datetime, timezone
from typing import Annotated

import numpy as np
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile

from app.auth import hash_password, require_admin
from app.core.config import settings
from app.db import get_db
from app.models import PersonOut, UserCreate, UserOut
from app.services.face import encode_single_face, load_image_bytes
from app.services.video import KnownPerson, scan_video_for_matches

router = APIRouter(prefix="/admin", tags=["admin"])


def _save_upload(data: bytes, target_dir: str, filename: str) -> str:
    os.makedirs(target_dir, exist_ok=True)
    path = os.path.join(target_dir, filename)
    with open(path, "wb") as f:
        f.write(data)
    return path


# ── Criminals ─────────────────────────────────────────────────────────────────

@router.post("/criminals", response_model=PersonOut)
async def add_criminal(
    full_name: Annotated[str, Form(...)],
    crime: Annotated[str | None, Form()] = None,
    last_known_location: Annotated[str | None, Form()] = None,
    dob: Annotated[str | None, Form()] = None,
    gender: Annotated[str | None, Form()] = None,
    national_id: Annotated[str | None, Form()] = None,
    notes: Annotated[str | None, Form()] = None,
    image: UploadFile = File(...),
    _=Depends(require_admin),
):
    db = get_db()
    data = await image.read()
    rgb = load_image_bytes(data)
    encoding = encode_single_face(rgb)
    if encoding is None:
        raise HTTPException(status_code=400, detail="No face detected")

    filename = f"criminal_{full_name.replace(' ', '_')}_{int(datetime.now().timestamp())}.jpg"
    image_path = _save_upload(data, settings.criminals_dir, filename)

    doc = {
        "_id": f"criminal:{full_name}:{int(datetime.now().timestamp())}",
        "full_name": full_name,
        "crime": crime,
        "last_known_location": last_known_location,
        "dob": dob,
        "gender": gender,
        "national_id": national_id,
        "notes": notes,
        "image_path": image_path,
        "embedding": encoding.tolist(),
        "created_at": datetime.now(timezone.utc),
    }
    await db.criminals.insert_one(doc)
    return PersonOut(**doc)


@router.delete("/criminals/{criminal_id}")
async def delete_criminal(criminal_id: str, _=Depends(require_admin)):
    db = get_db()
    await db.criminals.delete_one({"_id": criminal_id})
    return {"status": "deleted"}


@router.get("/criminals", response_model=list[PersonOut])
async def list_criminals(_=Depends(require_admin)):
    db = get_db()
    items = await db.criminals.find().to_list(length=200)
    return [PersonOut(**doc) for doc in items]


# ── Missing Persons ────────────────────────────────────────────────────────────

@router.post("/missing", response_model=PersonOut)
async def add_missing(
    full_name: Annotated[str, Form(...)],
    last_seen: Annotated[str | None, Form()] = None,
    dob: Annotated[str | None, Form()] = None,
    gender: Annotated[str | None, Form()] = None,
    national_id: Annotated[str | None, Form()] = None,
    notes: Annotated[str | None, Form()] = None,
    image: UploadFile = File(...),
    _=Depends(require_admin),
):
    db = get_db()
    data = await image.read()
    rgb = load_image_bytes(data)
    encoding = encode_single_face(rgb)
    if encoding is None:
        raise HTTPException(status_code=400, detail="No face detected")

    filename = f"missing_{full_name.replace(' ', '_')}_{int(datetime.now().timestamp())}.jpg"
    image_path = _save_upload(data, settings.missing_dir, filename)

    doc = {
        "_id": f"missing:{full_name}:{int(datetime.now().timestamp())}",
        "full_name": full_name,
        "last_seen": last_seen,
        "dob": dob,
        "gender": gender,
        "national_id": national_id,
        "notes": notes,
        "image_path": image_path,
        "embedding": encoding.tolist(),
        "created_at": datetime.now(timezone.utc),
    }
    await db.missing.insert_one(doc)
    return PersonOut(**doc)


@router.delete("/missing/{missing_id}")
async def delete_missing(missing_id: str, _=Depends(require_admin)):
    db = get_db()
    await db.missing.delete_one({"_id": missing_id})
    return {"status": "deleted"}


@router.get("/missing", response_model=list[PersonOut])
async def list_missing(_=Depends(require_admin)):
    db = get_db()
    items = await db.missing.find().to_list(length=200)
    return [PersonOut(**doc) for doc in items]


# ── Officers ──────────────────────────────────────────────────────────────────

@router.get("/officers", response_model=list[UserOut])
async def list_officers(_=Depends(require_admin)):
    db = get_db()
    items = await db.users.find({"role": "officer"}).to_list(length=200)
    return [UserOut(**doc) for doc in items]


@router.post("/officers", response_model=UserOut)
async def add_officer(payload: UserCreate, _=Depends(require_admin)):
    db = get_db()
    existing = await db.users.find_one({"username": payload.username})
    if existing:
        raise HTTPException(status_code=409, detail="User exists")
    doc = {
        "_id": payload.username,
        "username": payload.username,
        "full_name": payload.full_name,
        "email": payload.email,
        "role": "officer",
        "password_hash": hash_password(payload.password),
    }
    await db.users.insert_one(doc)
    return UserOut(**doc)


@router.delete("/officers/{username}")
async def delete_officer(username: str, _=Depends(require_admin)):
    db = get_db()
    await db.users.delete_one({"_id": username, "role": "officer"})
    return {"status": "deleted"}


# ── CCTV Upload & Analysis ────────────────────────────────────────────────────

@router.post("/cctv")
async def upload_cctv(
    footages: list[UploadFile] = File(...),
    search_for: str = Query("all", enum=["all", "criminals", "missing"]),
    _=Depends(require_admin),
):
    """
    Scan multiple uploaded CCTV footages against BOTH the criminal database AND the
    missing persons database.
    """
    from app.services.email import notify_all_officers

    db = get_db()
    
    # ── Unified known-people list (criminals + missing) ────────────────────
    known_people = []
    if search_for == "all" or search_for == "criminals":
        known_people.extend(await db.criminals.find().to_list(length=500))
    if search_for == "all" or search_for == "missing":
        known_people.extend(await db.missing.find().to_list(length=500))

    # Map person_id → full DB document for email enrichment
    person_map: dict[str, dict] = {}
    known: list[KnownPerson] = []

    for person in known_people:
        emb = person.get("embedding")
        if emb:
            pid = str(person["_id"])
            category = "Criminal" if "crime" in person else "Missing Person"
            known.append(KnownPerson(person_id=pid, name=person["full_name"], embedding=np.array(emb)))
            person_map[pid] = {**person, "_category": category}

    all_results = []

    for footage in footages:
        data = await footage.read()
        filename = f"cctv_{int(datetime.now().timestamp())}_{footage.filename}"
        video_path = _save_upload(data, settings.uploads_dir, filename)

        matches = scan_video_for_matches(video_path, known)

        # ── Persist matches and dispatch email alerts ──────────────────────────
        if matches:
            match_docs = []
            person_detections: dict[str, list] = defaultdict(list)

            for m in matches:
                now = datetime.now(timezone.utc)
                match_docs.append({
                    "person_id":    m.person_id,
                    "person_name":  m.person_name,
                    "similarity":   m.similarity,
                    "frame_path":   m.frame_path,
                    "timestamp_ms": m.timestamp_ms,
                    "video_path":   video_path,
                    "created_at":   now,
                })
                person_detections[m.person_id].append({
                    "frame_path":   m.frame_path,
                    "timestamp_ms": m.timestamp_ms,
                    "video_path":   video_path,
                    "created_at":   now,
                })

            await db.cctv_matches.insert_many(match_docs)

            # One email per matched person containing ALL their detection frames
            for person_id, det_list in person_detections.items():
                doc = person_map.get(person_id, {})
                best_similarity = max(
                    m.similarity for m in matches if m.person_id == person_id
                )
                await notify_all_officers(
                    db=db,
                    person_name=doc.get("full_name", "Unknown"),
                    match_type=doc.get("_category", "Unknown"),
                    confidence=best_similarity,
                    detections=det_list,
                    crime=doc.get("crime") or doc.get("last_seen"),
                    last_known_location=doc.get("last_known_location"),
                    national_id=doc.get("national_id"),
                    dob=doc.get("dob"),
                    profile_image_path=doc.get("image_path"),
                )

        all_results.append({
            "video_path": video_path,
            "matches": [
                {
                    "person_id":    m.person_id,
                    "person_name":  m.person_name,
                    "similarity":   m.similarity,
                    "frame_path":   m.frame_path,
                    "timestamp_ms": m.timestamp_ms,
                }
                for m in matches
            ],
        })

    return all_results


# ── Email / SMTP Settings ─────────────────────────────────────────────────────

@router.get("/email-settings")
async def get_email_settings(_=Depends(require_admin)):
    """Return current SMTP configuration (password masked)."""
    return {
        "smtp_host":  settings.smtp_host,
        "smtp_port":  settings.smtp_port,
        "smtp_user":  settings.smtp_user or "",
        "smtp_pass":  "••••••••" if settings.smtp_pass else "",
        "smtp_from":  settings.smtp_from,
        "configured": bool(settings.smtp_user and settings.smtp_pass),
    }


@router.put("/email-settings")
async def update_email_settings(payload: dict, _=Depends(require_admin)):
    """
    Persist SMTP settings to the backend .env file and hot-patch the running
    settings object so alerts work immediately (no restart required for the
    current process lifetime).
    """
    # Resolve path:  backend/app/routes/admin.py → backend/.env
    env_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"
    )

    try:
        with open(env_path, "r") as f:
            lines = f.readlines()
    except FileNotFoundError:
        lines = []

    def set_var(lines: list[str], key: str, value: str) -> list[str]:
        updated = False
        result = []
        for line in lines:
            if re.match(rf"^{key}\s*=", line):
                result.append(f"{key}={value}\n")
                updated = True
            else:
                result.append(line)
        if not updated:
            result.append(f"{key}={value}\n")
        return result

    new_pass = payload.get("smtp_pass", "")
    fields: dict[str, str] = {
        "SMTP_HOST": payload.get("smtp_host", "smtp.gmail.com"),
        "SMTP_PORT": str(payload.get("smtp_port", 587)),
        "SMTP_USER": payload.get("smtp_user", ""),
        "SMTP_FROM": payload.get("smtp_from", ""),
    }
    if new_pass and new_pass != "••••••••":
        fields["SMTP_PASS"] = new_pass

    for key, value in fields.items():
        lines = set_var(lines, key, value)

    with open(env_path, "w") as f:
        f.writelines(lines)

    # Hot-patch running settings object
    settings.smtp_host = payload.get("smtp_host", settings.smtp_host)
    settings.smtp_port = int(payload.get("smtp_port", settings.smtp_port))
    settings.smtp_user = payload.get("smtp_user") or None
    if new_pass and new_pass != "••••••••":
        settings.smtp_pass = new_pass
    settings.smtp_from = payload.get("smtp_from", settings.smtp_from)

    return {"status": "saved", "message": "SMTP settings updated successfully."}


@router.post("/test-email")
async def send_test_email(payload: dict, _=Depends(require_admin)):
    """Send a test alert email to verify the SMTP configuration is working."""
    from app.services.email import send_alert_email

    to_email = payload.get("to_email")
    if not to_email:
        raise HTTPException(status_code=400, detail="to_email is required")

    try:
        await send_alert_email(
            to_email=to_email,
            person_name="Test Subject",
            match_type="Test Alert",
            confidence=0.95,
            detections=[],
            crime="System diagnostics — ignore this message",
            last_known_location="IDENTIX Surveillance Lab",
            national_id="TEST-001",
            dob="N/A",
            profile_image_path=None,
        )
        return {"status": "sent", "message": f"Test email dispatched to {to_email}"}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Email dispatch failed: {exc}")
