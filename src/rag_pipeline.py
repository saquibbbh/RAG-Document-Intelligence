from .pdf_loader import load_pdf
from .chunker import create_chunks
from .embeddings import generate_embeddings
from .vector_store import create_vector_store
from .retriever import retrieve
from .generator import generate_answer


def build_rag_pipeline(pdf_path):
    pages = load_pdf(pdf_path)

    chunks = create_chunks(pages)

    texts = [chunk["text"] for chunk in chunks]

    embeddings = generate_embeddings(texts)

    index = create_vector_store(embeddings)

    return pages, chunks, embeddings, index


def ask_rag(query, chunks, index, api_key, k=3):
    query_embedding = generate_embeddings([query])

    results = retrieve(
        index,
        query_embedding,
        chunks,
        k=k
    )

    context = "\n\n".join(
        [
            f"[Page {result['page']}]\n{result['text']}"
            for result in results
        ]
    )

    answer = generate_answer(
        context,
        query,
        api_key
    )

    return answer, results