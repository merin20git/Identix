from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings


class Mongo:
    client: AsyncIOMotorClient | None = None


mongo = Mongo()


def get_db():
    if mongo.client is None:
        mongo.client = AsyncIOMotorClient(settings.mongo_uri)
    return mongo.client[settings.mongo_db]
