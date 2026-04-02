from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "IDENTIX"
    api_prefix: str = "/api"
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_exp_minutes: int = 480

    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db: str = "identix"

    media_root: str = "data"
    criminals_dir: str = "data/criminals"
    missing_dir: str = "data/missing"
    uploads_dir: str = "data/uploads"
    frames_dir: str = "data/frames"

    match_threshold: float = 0.6
    frame_stride: int = 15

    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_pass: str | None = None
    smtp_from: str = "identix-alerts@agency.gov"


settings = Settings()
