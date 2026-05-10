import os

from pymongo import MongoClient
from pymongo.server_api import ServerApi

client = None
db = None


def connect():
    global client
    global db

    client = MongoClient(
        os.environ["uri"],
        server_api=ServerApi("1")
    )

    db = client["my_code_snippet"]

    db.users.create_index("email", unique=True)

    db.snippets.create_index("createdBy")

    try:
        db.snippets.drop_index("title_text_tags_text")
    except Exception:
        pass

    db.snippets.create_index([
        ("title", "text"),
        ("tags", "text")
    ])


def get_db():
    return db


def user_collection():
    return db["users"]


def snippet_collection():
    return db["snippets"]


def bookmark_collection():
    return db["bookmarks"]