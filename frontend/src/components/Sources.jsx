// Retrieved passages. Visually quieter than the answer; long passages expand on click.
import { useState } from "react";

function SourceCard({ source }) {
  const [open, setOpen] = useState(false);
  const page = source.page ?? null; // page can be null - still show the card
  const long = (source.text || "").length > 220;
  return (
    <li className="source">
      <div className="source-top">
        <strong>{page === null ? "Page unavailable" : `Page ${page}`}</strong>
        {typeof source.distance === "number" && (
          <span className="distance">Similarity distance: {source.distance.toFixed(3)}</span>
        )}
      </div>
      <p className={open ? "" : "clamp"}>{source.text}</p>
      {long && (
        <button className="link" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? "Show less" : "Show full passage"}
        </button>
      )}
    </li>
  );
}

export default function Sources({ sources }) {
  if (!sources.length) return null;
  return (
    <section className="sources" aria-label="Sources">
      <h3>Sources <span>({sources.length} passages retrieved)</span></h3>
      <ul>{sources.map((s, i) => <SourceCard key={i} source={s} />)}</ul>
    </section>
  );
}
