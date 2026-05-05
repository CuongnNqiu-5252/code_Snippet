import os

from pymongo import AsyncMongoClient

client : AsyncMongoClient = None

def get_db():
    return client[os.getenv("DB_NAME")]

async def connect():
    global client
    print("Connecting to:", os.getenv("MONGO_URI"))
    client = AsyncMongoClient(os.environ["MONGO_URI"])
    db = get_db()
    await db.users.create_index("email", unique=True)
    await db.snippets.create_index("createdBy")
    await db.snippets.create_index([("title", "text"), ("tags", "text")])

def user_collection():
    return get_db().get_collection("users")
async def snippet_collection():
    return get_db().get_collection("snippets")

async def bookmark_collection():
    return get_db().get_collection("bookmarks")