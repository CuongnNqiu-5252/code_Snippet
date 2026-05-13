import asyncio
import json
from enum import Enum
from time import sleep
from typing import AsyncIterable, Iterable

from fastapi import FastAPI
from fastapi.sse import EventSourceResponse, ServerSentEvent
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from starlette.testclient import TestClient

from app.api.auth import auth
from app.api.search import search
from app.api.snippets import snippets
from app.api.test import test
from app.core.database import connect, get_db
from dotenv import load_dotenv

from app.core.queue import event_queue
from app.middleware.log import ActionLoggingMiddleware
from app.models import snippet

load_dotenv()
app = FastAPI()
class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(snippets.router)
app.include_router(search.router)
app.include_router(test.router)
app.add_middleware(ActionLoggingMiddleware)
@app.on_event("startup")
def startup():
    connect()

@app.get("/")
async def root():
    return {"message": "Hello"}
# @app.get("/items/{item_id}")
# async def read_item(item_id: int):
#     return {"item_id": item_id}

class Item(BaseModel):
    name: str
    description: str | None


items = [
    Item(name="Plumbus", description="A multi-purpose household device."),
    Item(name="Portal Gun", description="A portal opening device."),
    Item(name="Meeseeks Box", description="A box that summons a Meeseeks."),


]

# @app.get("/items/stream", response_class=EventSourceResponse)
# async def sse_items() -> AsyncIterable[Item]:
#     for item in items:
#         yield item
@app.get("/event", response_class=EventSourceResponse)
async def stream():
    print("🔌 SSE ENDPOINT HIT")

    while True:
        event = await event_queue.get()
        print("📦 EVENT RECEIVED:", event)

        yield {
            "event": event["type"],
            "data": event["data"]
        }
