// All communication with the FastAPI backend lives here (nowhere else).
const API_URL = "http://127.0.0.1:8000";

// Is the server reachable? "no-cors" lets us check even if CORS isn't set up yet.
export async function pingApi() {
  try {
    const res = await fetch(`${API_URL}/`);
    return res.ok;
  } catch {
    return false;
  }
}

// POST /ask -> { answer, sources }. Throws an Error with a user-friendly message.
export async function askQuestion(query) {
  let res;
  try {
    res = await fetch(`${API_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
  } catch {
    // fetch fails for both "server down" and "blocked by CORS" - tell them apart.
    const serverIsUp = await pingApi();
    throw new Error(
      serverIsUp
        ? "The browser blocked the request (CORS). Add CORSMiddleware to your FastAPI backend, then restart it."
        : "Unable to connect to the RAG API. Make sure the FastAPI server is running."
    );
  }

  if (!res.ok) {
    throw new Error(`The server returned an error (HTTP ${res.status}). Please try again.`);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("The server sent a response that could not be read.");
  }
  if (typeof data?.answer !== "string") {
    throw new Error("The server response was missing an answer.");
  }
  return { answer: data.answer, sources: Array.isArray(data.sources) ? data.sources : [] };
}

export async function uploadPdf(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed (HTTP ${res.status}).`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}