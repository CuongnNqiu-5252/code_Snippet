import os

from pymongo import AsyncMongoClient

client : AsyncMongoClient = None

def get_db():
    return client[os.getenv("DB_NAME")]
async def create_indexes():
    db = get_db()
    await db.snippets.create_index("language")
async def connect():
    global client
    client = AsyncMongoClient(os.environ["MONGO_URI"])
    db = get_db()
    await db.users.create_index("email", unique=True)
    await db.snippets.create_index("createdBy")
    try:
        await db.snippets.drop_index("title_text_tags_text")
    except Exception:
        pass
    await db.snippets.create_index(
        [("title", "text"), ("tags", "text")],
        language_override="search_language",
    )

def user_collection():
    return get_db().get_collection("users")
async def snippet_collection():
    return get_db().get_collection("snippets")

async def bookmark_collection():
    return get_db().get_collection("bookmarks")