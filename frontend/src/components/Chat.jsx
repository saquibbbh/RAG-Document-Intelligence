// The scrolling conversation area. Shows the welcome screen until the first question.
import { useEffect, useRef } from "react";
import Answer from "./Answer.jsx";
import Sources from "./Sources.jsx";

const EXAMPLES = [
  "What are the main objectives?",
  "What technologies are used?",
  "What datasets were used?",
  "Explain the system architecture.",
];

export default function Chat({ turns, onPick, loading }) {
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns]);

  if (turns.length === 0) {
    return (
      <main className="chat">
        <section className="welcome">
          <h2>Ask anything about your document</h2>
          <p>Answers are written from the passages your document actually contains, with the pages shown underneath.</p>
          <div className="examples">
            {EXAMPLES.map((q) => (
              <button key={q} className="example" onClick={() => onPick(q)} disabled={loading}>
                {q}
              </button>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="chat">
      {turns.map((t) => (
        <article className="turn" key={t.id}>
          <div className="question">{t.query}</div>
          {t.error ? (
            <div className="error" role="alert">{t.error}</div>
          ) : t.answer === undefined ? (
            <div className="thinking" aria-live="polite">
              Thinking<span className="dots"><i /><i /><i /></span>
            </div>
          ) : (
            <>
              <Answer text={t.answer} />
              <Sources sources={t.sources} />
            </>
          )}
        </article>
      ))}
      <div ref={endRef} />
    </main>
  );
}
