import numpy as np


def retrieve(index, query_embedding, chunks, k=3):
    query_embedding = np.array(query_embedding).astype("float32")

    distances, indices = index.search(query_embedding, k)

    results = []

    for index_number in indices[0]:
        results.append(chunks[index_number])

    return results