// The question box pinned to the bottom. Enter sends, Shift+Enter adds a new line.
import { useState } from "react";

export default function QuestionInput({ onSubmit, loading }) {
  const [value, setValue] = useState("");
  const [hint, setHint] = useState("");

  function submit(e) {
    e.preventDefault();
    if (loading) return;
    if (!value.trim()) return setHint("Type a question first.");
    setHint("");
    onSubmit(value.trim());
    setValue("");
  }

  return (
    <footer className="composer">
      <form onSubmit={submit} className="composer-inner">
        <textarea
          rows={1}
          value={value}
          placeholder="Ask a question about your document"
          aria-label="Your question"
          onChange={(e) => { setValue(e.target.value); setHint(""); }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submit(e); }}
        />
        <button type="submit" disabled={loading}>{loading ? "Thinking…" : "Ask"}</button>
      </form>
      {hint && <p className="hint" role="alert">{hint}</p>}
    </footer>
  );
}
