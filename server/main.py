
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from dotenv import load_dotenv
import os

load_dotenv()
openai.api_key = os.getenv("PTELLINGENCE_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        ('https://ptellingence-aesq611d8-sergey-grigoryevs-projects.vercel.app'),],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class IntakeRequest(BaseModel):
    symptoms: str
    goal: str
    patient_file: str


class FollowUpRequest(BaseModel):
    question: str
    chat_history: list[dict[str, str]]


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

    In as few tokens as possible, respond with:
    - Contraindications
    - Recommended exercises
    - Notes or clinical reasoning
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.25
    )

    content = response["choices"][0]["message"]["content"]
    return {"suggestions": content}


@app.post("/follow-up")
async def follow_up(data: FollowUpRequest):
    question = data.question
    chat_history = data.chat_history

    # Format the chat history for the AI
    messages = [{"role": msg["role"], "content": msg["content"]}
                for msg in chat_history]
    messages.append({"role": "user", "content": question})

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        temperature=0.25
    )

    return {"response": response["choices"][0]["message"]["content"]}
