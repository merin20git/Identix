from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    username: str
    password: str


class UserCreate(BaseModel):
    username: str
    password: str
    full_name: str
    email: Optional[str] = None


class UserOut(BaseModel):
    id: str = Field(alias="_id")
    username: str
    full_name: str
    role: str
    email: Optional[str] = None


class PersonBase(BaseModel):
    full_name: str
    dob: Optional[str] = None
    gender: Optional[str] = None
    national_id: Optional[str] = None
    notes: Optional[str] = None


class CriminalCreate(PersonBase):
    crime: Optional[str] = None
    last_known_location: Optional[str] = None


class MissingCreate(PersonBase):
    last_seen: Optional[str] = None


class PersonOut(PersonBase):
    id: str = Field(alias="_id")
    image_path: str
    created_at: datetime
    crime: Optional[str] = None
    last_seen: Optional[str] = None
    last_known_location: Optional[str] = None


class CCTVMatchOut(BaseModel):
    frame_path: str
    timestamp_ms: int
    video_path: Optional[str] = None
    created_at: Optional[datetime] = None


class MatchResult(BaseModel):
    person_id: str
    person_name: str
    similarity: float
    image_path: str
    crime: Optional[str] = None
    last_seen: Optional[str] = None
    last_known_location: Optional[str] = None
    cctv_detections: list[CCTVMatchOut] = []


class FrameMatch(BaseModel):
    person_id: str
    person_name: str
    similarity: float
    frame_path: str
    timestamp_ms: int


class CCTVResult(BaseModel):
    video_path: str
    matches: list[FrameMatch]
