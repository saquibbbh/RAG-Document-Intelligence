// App owns the state (conversation, loading, API status) and passes it down.
import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Chat from "./components/Chat.jsx";
import QuestionInput from "./components/QuestionInput.jsx";
import Upload from "./components/Upload.jsx";
import { askQuestion, pingApi } from "./services/api.js";

export default function App() {
  const [turns, setTurns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(null);

  useEffect(() => {
    pingApi().then(setConnected);
  }, []);

  async function handleAsk(query) {
    const id = Date.now();
    setTurns((t) => [...t, { id, query }]);
    setLoading(true);

    const update = (patch) =>
      setTurns((t) =>
        t.map((x) => (x.id === id ? { ...x, ...patch } : x))
      );

    try {
      update(await askQuestion(query));
      setConnected(true);
    } catch (err) {
      update({ error: err.message });
      setConnected(await pingApi());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <Header connected={connected} />

      <Upload />

      <Chat
        turns={turns}
        onPick={handleAsk}
        loading={loading}
      />

      <QuestionInput
        onSubmit={handleAsk}
        loading={loading}
      />
    </div>
  );
}