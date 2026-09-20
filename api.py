from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

from src.rag_pipeline import build_rag_pipeline, ask_rag
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Question(BaseModel):
    query: str


pdf_path = r"C:\Users\ASUS\OneDrive\Desktop\RAG-Document-Intelligence\data\sample.pdf"

pages, chunks, embeddings, index = build_rag_pipeline(pdf_path)

api_key = os.getenv("OPENROUTER_API_KEY")


@app.get("/")
def home():
    return {"message": "RAG API is running"}


@app.post("/ask")
def ask_question(question: Question):

    answer, results = ask_rag(
        question.query,
        chunks,
        index,
        api_key
    )

    return {
        "query": question.query,
        "answer": answer,
        "sources": results
    }