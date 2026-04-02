import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.routes import admin, auth, officer


app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] ,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"] ,
)

for path in [settings.media_root, settings.criminals_dir, settings.missing_dir, settings.uploads_dir, settings.frames_dir]:
    os.makedirs(path, exist_ok=True)

app.mount("/media", StaticFiles(directory=settings.media_root), name="media")

app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(admin.router, prefix=settings.api_prefix)
app.include_router(officer.router, prefix=settings.api_prefix)


@app.get("/")
async def root():
    return {"service": settings.app_name}
