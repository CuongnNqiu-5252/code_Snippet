import os

import requests




async def create_embedding(input):
    response = requests.post(
        "https://openrouter.ai/api/v1/embeddings",
        headers={
            "Authorization": f"Bearer "+ os.environ.get("OPENROUTER_API_KEY"),
            "Content-Type": "application/json",
        },
        json={
            "model": "openai/text-embedding-3-small",
            "input": input
        }
    )
    return response.json()


OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "openai/gpt-oss-120b:free"


async def generate_summary(code: str) -> str:
    try:
        response = requests.post(
            OPENROUTER_URL,
            headers={
                "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
                "Content-Type": "application/json",
            },
            json={
                "model": MODEL,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a senior software engineer. Summarize code clearly and concisely."
                    },
                    {
                        "role": "user",
                        "content": f"Summarize this code:\n\n{code}"
                    }
                ],
                "temperature": 0.3
            }
        )

        data = response.json()

        return data["choices"][0]["message"]["content"]

    except Exception as e:
        return f"Summary generation failed: {str(e)}"