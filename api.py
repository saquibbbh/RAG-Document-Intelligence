from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

from src.rag_pipeline import build_rag_pipeline, ask_rag
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
],
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


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    if file.content_type != "application/pdf":
        return {
            "error": "Only PDF files are allowed"
        }

    pdf_bytes = await file.read()

    upload_path = "uploaded.pdf"

    with open(upload_path, "wb") as f:
        f.write(pdf_bytes)

    # Build RAG pipeline from uploaded PDF
    global pages, chunks, embeddings, index

    pages, chunks, embeddings, index = build_rag_pipeline(upload_path)

    return {
        "filename": file.filename,
        "message": "PDF uploaded and RAG pipeline built successfully",
        "pages": len(pages),
        "chunks": len(chunks)
    }