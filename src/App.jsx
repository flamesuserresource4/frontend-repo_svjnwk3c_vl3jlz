import { useEffect, useState } from "react";
import Header from "./components/Header";
import PlayerForm from "./components/PlayerForm";
import InningsForm from "./components/InningsForm";
import PlayerList from "./components/PlayerList";
import PlayerDetail from "./components/PlayerDetail";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

function App() {
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadPlayers() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/players`);
      const json = await res.json();
      setPlayers(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlayers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <Header />
      <main className="max-w-5xl mx-auto p-4 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <PlayerForm onCreated={loadPlayers} />
          <InningsForm players={players} onAdded={loadPlayers} />
        </div>

        <PlayerList players={players} onRefresh={loadPlayers} onSelect={setSelected} />
        {loading && <div className="text-center text-sm text-gray-500">Loading...</div>}
      </main>

      {selected && <PlayerDetail player={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default App;
