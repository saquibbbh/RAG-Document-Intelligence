// Top bar: title, subtitle and the API status indicator.
export default function Header({ connected }) {
  const state = connected === null ? "checking" : connected ? "on" : "off";
  const label = { checking: "Checking API", on: "API Connected", off: "API Disconnected" }[state];
  return (
    <header className="header">
      <div className="header-inner">
        <div>
          <h1>RAG Document Intelligence</h1>
          <p>Ask questions about your documents using AI</p>
        </div>
        <span className={`status status-${state}`} role="status">
          <span className="dot" aria-hidden="true">●</span> {label}
        </span>
      </div>
    </header>
  );
}
