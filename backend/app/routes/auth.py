from fastapi import APIRouter, HTTPException, status

from app.auth import create_access_token, hash_password, verify_password
from app.db import get_db
from app.models import LoginRequest, Token, UserCreate, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
async def login(payload: LoginRequest):
    db = get_db()
    user = await db.users.find_one({"username": payload.username})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(user["_id"], user["role"], user.get("full_name", ""))
    return Token(access_token=token)


@router.post("/bootstrap-admin", response_model=UserOut)
async def bootstrap_admin(payload: UserCreate):
    db = get_db()
    existing_admin = await db.users.find_one({"role": "admin"})
    if existing_admin:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Admin already exists")
    doc = {
        "_id": payload.username,
        "username": payload.username,
        "full_name": payload.full_name,
        "role": "admin",
        "password_hash": hash_password(payload.password),
    }
    await db.users.insert_one(doc)
    return UserOut(**doc)
