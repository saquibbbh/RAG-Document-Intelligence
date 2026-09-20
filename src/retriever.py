import numpy as np


def retrieve(index, query_embedding, chunks, k=3):
    query_embedding = np.array(query_embedding).astype("float32")

    # Retrieve more candidates
    distances, indices = index.search(query_embedding, k * 5)

    candidates = []

    for distance, index_number in zip(distances[0], indices[0]):
        chunk = chunks[index_number]

        candidates.append({
            "text": chunk["text"],
            "page": chunk["page"],
            "distance": float(distance)
        })

    # Remove very short chunks
    candidates = [
        result for result in candidates
        if len(result["text"]) >= 200
    ]

    # Return the closest remaining results
    candidates.sort(key=lambda x: x["distance"])

    return candidates[:k]