import os
import requests


class OpenAIClient:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.base_url = "https://openrouter.ai/api/v1"
    
    def embed(self, text: str):
        response = requests.post(
            f"{self.base_url}/embeddings",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "openai/text-embedding-3-small",
                "input": text
            }
        )
        return response.json()


openai_client = OpenAIClient()