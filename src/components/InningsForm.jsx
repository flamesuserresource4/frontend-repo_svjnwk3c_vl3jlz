import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function InningsForm({ players, onAdded }) {
  const [playerId, setPlayerId] = useState("");
  const [runs, setRuns] = useState(0);
  const [balls, setBalls] = useState(0);
  const [fours, setFours] = useState(0);
  const [sixes, setSixes] = useState(0);
  const [out, setOut] = useState(true);
  const [opposition, setOpposition] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!playerId && players?.length) {
      setPlayerId(players[0]._id);
    }
  }, [players, playerId]);

  const sr = useMemo(() => {
    return balls > 0 ? ((Number(runs) / Number(balls)) * 100).toFixed(2) : "0.00";
  }, [runs, balls]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!playerId) return alert("Select a player");
    if (Number(balls) < Number(runs)) return alert("Runs cannot exceed balls");
    setLoading(true);
    try {
      const payload = {
        player_id: playerId,
        runs: Number(runs),
        balls: Number(balls),
        fours: Number(fours),
        sixes: Number(sixes),
        out,
        opposition: opposition || null,
        venue: venue || null,
        date: date ? new Date(date).toISOString() : null,
      };
      const res = await fetch(`${API_BASE}/innings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add innings");
      await res.json();
      setRuns(0); setBalls(0); setFours(0); setSixes(0); setOut(true); setOpposition(""); setVenue(""); setDate("");
      onAdded?.();
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold mb-3">Add Innings</h2>
        <p className="text-sm text-gray-500">SR: <span className="font-semibold text-emerald-700">{sr}</span></p>
      </div>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-6 gap-2">
        <select
          className="px-3 py-2 rounded-md border bg-white col-span-2 focus:outline-none focus:ring focus:ring-emerald-200"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
        >
          {players?.length ? null : <option value="">No players</option>}
          {players?.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
        <input type="number" className="px-3 py-2 rounded-md border" placeholder="Runs" value={runs} min={0} onChange={(e) => setRuns(e.target.value)} />
        <input type="number" className="px-3 py-2 rounded-md border" placeholder="Balls" value={balls} min={0} onChange={(e) => setBalls(e.target.value)} />
        <input type="number" className="px-3 py-2 rounded-md border" placeholder="4s" value={fours} min={0} onChange={(e) => setFours(e.target.value)} />
        <input type="number" className="px-3 py-2 rounded-md border" placeholder="6s" value={sixes} min={0} onChange={(e) => setSixes(e.target.value)} />
        <div className="flex items-center gap-2 col-span-2">
          <input id="out" type="checkbox" checked={out} onChange={(e) => setOut(e.target.checked)} />
          <label htmlFor="out" className="text-sm">Out</label>
        </div>
        <input className="px-3 py-2 rounded-md border col-span-2" placeholder="Opposition" value={opposition} onChange={(e) => setOpposition(e.target.value)} />
        <input className="px-3 py-2 rounded-md border col-span-2" placeholder="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
        <input type="date" className="px-3 py-2 rounded-md border col-span-2" value={date} onChange={(e) => setDate(e.target.value)} />
        <button type="submit" disabled={loading} className="col-span-2 sm:col-span-1 px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
      </form>
    </div>
  );
}
