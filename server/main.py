
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IntakeRequest(BaseModel):
    patient_name: str
    symptoms: str
    goal: str
    patient_file: str

@app.post("/generate-plan")
async def generate_plan(data: IntakeRequest):
    prompt = f"""
    You are a physical therapy assistant AI. Given the patient's medical file, symptoms, and goals,
    recommend a safe and effective rehabilitation plan.

    Patient File:
    {data.patient_file}

    Symptoms:
    {data.symptoms}

    Goal:
    {data.goal}

    Respond with:
    - Contraindications
    - Recommended exercises
    - Notes or clinical reasoning
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5
    )

    content = response["choices"][0]["message"]["content"]
    return {"suggestions": content}
