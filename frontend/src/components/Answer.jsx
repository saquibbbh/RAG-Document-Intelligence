// The main answer, set like a page of writing. Blank lines become paragraphs.
export default function Answer({ text }) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim());
  return (
    <section className="answer" aria-label="Answer">
      {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
    </section>
  );
}
