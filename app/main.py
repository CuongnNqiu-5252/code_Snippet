from enum import Enum

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.api.auth import auth
from app.api.search import search
from app.api.snippets import snippets
from app.api.test import test
from app.core.database import connect
from dotenv import load_dotenv

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
@app.on_event("startup")
def startup():
    connect()
@app.get("app/models/{model_name}")
async def get_model(model_name: ModelName):
    if model_name is ModelName.alexnet:
        return {"model_name": model_name, "message": "Deep Learning FTW!"}

    if model_name.value == "lenet":
        return {"model_name": model_name, "message": "LeCNN all the images"}

    return {"model_name": model_name, "message": "Have some residuals"}

@app.get("/")
async def root():
    return {"message": "Hello"}
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
