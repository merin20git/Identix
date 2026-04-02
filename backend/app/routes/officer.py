import os
from datetime import datetime, timezone
from typing import Annotated

import numpy as np
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile

from app.auth import require_officer
from app.core.config import settings
from app.db import get_db
from app.models import MatchResult, PersonOut
from app.services.email import notify_all_officers
from app.services.face import (
    compare_embeddings,
    encode_faces,
    encode_single_face,
    load_image_bytes,
    similarity_from_distance,
)

router = APIRouter(prefix="/officer", tags=["officer"])


def _save_upload(data: bytes, target_dir: str, filename: str) -> str:
    os.makedirs(target_dir, exist_ok=True)
    path = os.path.join(target_dir, filename)
    with open(path, "wb") as f:
        f.write(data)
    return path


async def _match_against(probe_encoding: np.ndarray, people: list[dict], db) -> list[MatchResult]:
    if not people:
        return []
    embeddings = [np.array(p["embedding"]) for p in people if p.get("embedding") is not None]
    if not embeddings:
        return []
    idx, distance = compare_embeddings(probe_encoding, embeddings)
    if idx is None or distance is None:
        return []
    if distance > settings.match_threshold:
        return []
    person = people[idx]
    person_id = str(person["_id"])
    full_name = person["full_name"]
    
    # Fetch CCTV detections for this person using both ID and Name for maximum compatibility
    cctv_matches = await db.cctv_matches.find({
        "$or": [
            {"person_id": person_id},
            {"person_name": full_name}
        ]
    }).sort("created_at", -1).to_list(length=100)
    
    cctv_detections = [
        {
            "frame_path": m["frame_path"],
            "timestamp_ms": m["timestamp_ms"],
            "video_path": m.get("video_path"),
            "created_at": m.get("created_at")
        }
        for m in cctv_matches
    ]

    return [
        MatchResult(
            person_id=person_id,
            person_name=full_name,
            similarity=similarity_from_distance(distance),
            image_path=person["image_path"],
            crime=person.get("crime"),
            last_seen=person.get("last_seen"),
            last_known_location=person.get("last_known_location"),
            cctv_detections=cctv_detections
        )
    ]


@router.post("/suspect-match", response_model=list[MatchResult])
async def suspect_match(
    image: UploadFile = File(...),
    _=Depends(require_officer),
):
    db = get_db()
    data = await image.read()
    rgb = load_image_bytes(data)
    encodings = encode_faces(rgb)
    if not encodings:
        raise HTTPException(status_code=400, detail="No face detected")
    
    criminals = await db.criminals.find().to_list(length=500)
    best_matches: dict[str, MatchResult] = {}
    
    for encoding in encodings:
        results = await _match_against(encoding, criminals, db)
        if results:
            match = results[0]
            pid = match.person_id
            
            # Only keep the match with highest similarity for this person
            if pid not in best_matches or match.similarity > best_matches[pid].similarity:
                best_matches[pid] = match
            
            # Save the uploaded probe as a detection frame for history
            filename = f"field_suspect_{match.person_name.replace(' ', '_')}_{int(datetime.now().timestamp())}.jpg"
            frame_path = _save_upload(data, settings.frames_dir, filename)
            
            await db.cctv_matches.insert_one({
                "person_id": match.person_id,
                "person_name": match.person_name,
                "similarity": match.similarity,
                "frame_path": frame_path,
                "timestamp_ms": 0,  # Field match, no video timestamp
                "created_at": datetime.now(timezone.utc),
                "source": "field_identification"
            })

            # Fetch full profile from DB for rich email
            criminal_doc = await db.criminals.find_one({"_id": match.person_id}) or {}
            await notify_all_officers(
                db=db,
                person_name=match.person_name,
                match_type="Criminal",
                confidence=match.similarity,
                detections=[{
                    "frame_path": frame_path,
                    "timestamp_ms": 0,
                    "video_path": None,
                    "created_at": datetime.now(timezone.utc),
                }],
                crime=criminal_doc.get("crime"),
                last_known_location=criminal_doc.get("last_known_location"),
                national_id=criminal_doc.get("national_id"),
                dob=criminal_doc.get("dob"),
                profile_image_path=criminal_doc.get("image_path"),
            )
            
    return list(best_matches.values())


@router.post("/missing-match", response_model=list[MatchResult])
async def missing_match(
    image: UploadFile = File(...),
    _=Depends(require_officer),
):
    db = get_db()
    data = await image.read()
    rgb = load_image_bytes(data)
    encodings = encode_faces(rgb)
    if not encodings:
        raise HTTPException(status_code=400, detail="No face detected")
    
    missing = await db.missing.find().to_list(length=500)
    best_matches: dict[str, MatchResult] = {}
    
    for encoding in encodings:
        results = await _match_against(encoding, missing, db)
        if results:
            match = results[0]
            pid = match.person_id
            
            # Only keep the match with highest similarity for this person
            if pid not in best_matches or match.similarity > best_matches[pid].similarity:
                best_matches[pid] = match
            
            # Save the uploaded probe as a detection frame for history
            filename = f"field_missing_{match.person_name.replace(' ', '_')}_{int(datetime.now().timestamp())}.jpg"
            frame_path = _save_upload(data, settings.frames_dir, filename)
            
            await db.cctv_matches.insert_one({
                "person_id": match.person_id,
                "person_name": match.person_name,
                "similarity": match.similarity,
                "frame_path": frame_path,
                "timestamp_ms": 0,  # Field match, no video timestamp
                "created_at": datetime.now(timezone.utc),
                "source": "field_verification"
            })

            # Fetch full profile from DB for rich email
            missing_doc = await db.missing.find_one({"_id": match.person_id}) or {}
            await notify_all_officers(
                db=db,
                person_name=match.person_name,
                match_type="Missing Person",
                confidence=match.similarity,
                detections=[{
                    "frame_path": frame_path,
                    "timestamp_ms": 0,
                    "video_path": None,
                    "created_at": datetime.now(timezone.utc),
                }],
                crime=missing_doc.get("last_seen"),
                last_known_location=missing_doc.get("last_known_location"),
                national_id=missing_doc.get("national_id"),
                dob=missing_doc.get("dob"),
                profile_image_path=missing_doc.get("image_path"),
            )
            
    return list(best_matches.values())


@router.get("/criminals/search", response_model=list[PersonOut])
async def search_criminals(
    name: Annotated[str | None, Query()] = None,
    _=Depends(require_officer),
):
    db = get_db()
    query = {}
    if name:
        query = {"full_name": {"$regex": name, "$options": "i"}}
    items = await db.criminals.find(query).to_list(length=200)
    return [PersonOut(**doc) for doc in items]


@router.get("/criminals/{criminal_id}", response_model=PersonOut)
async def get_criminal_detail(
    criminal_id: str,
    _=Depends(require_officer),
):
    db = get_db()
    person = await db.criminals.find_one({"_id": criminal_id})
    if not person:
        raise HTTPException(status_code=404, detail="Criminal not found")
    return PersonOut(**person)


@router.get("/missing", response_model=list[PersonOut])
async def list_missing(_=Depends(require_officer)):
    db = get_db()
    items = await db.missing.find().to_list(length=200)
    return [PersonOut(**doc) for doc in items]


@router.post("/missing", response_model=PersonOut)
async def add_missing(
    full_name: Annotated[str, Form(...)],
    last_seen: Annotated[str | None, Form()] = None,
    dob: Annotated[str | None, Form()] = None,
    gender: Annotated[str | None, Form()] = None,
    national_id: Annotated[str | None, Form()] = None,
    notes: Annotated[str | None, Form()] = None,
    image: UploadFile = File(...),
    _=Depends(require_officer),
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
async def delete_missing(missing_id: str, _=Depends(require_officer)):
    db = get_db()
    await db.missing.delete_one({"_id": missing_id})
    return {"status": "deleted"}


@router.get("/missing/{missing_id}", response_model=PersonOut)
async def get_missing_detail(
    missing_id: str,
    _=Depends(require_officer),
):
    db = get_db()
    person = await db.missing.find_one({"_id": missing_id})
    if not person:
        raise HTTPException(status_code=404, detail="Missing person not found")
    return PersonOut(**person)


@router.get("/missing/{missing_id}/cctv-detections")
async def get_cctv_detections(
    missing_id: str,
    _=Depends(require_officer),
):
    db = get_db()
    # Query the matches for this specific person
    matches = await db.cctv_matches.find({"person_id": missing_id}).sort("created_at", -1).to_list(length=100)
    
    # Return formatted matches
    return [
        {
            "person_id": m["person_id"],
            "person_name": m["person_name"],
            "similarity": m["similarity"],
            "frame_path": m["frame_path"],
            "timestamp_ms": m["timestamp_ms"],
            "video_path": m.get("video_path"),
            "detected_at": m.get("created_at"),
        }
        for m in matches
    ]
