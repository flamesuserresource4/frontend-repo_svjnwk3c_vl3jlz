import { useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function PlayerForm({ onCreated }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role: role || null }),
      });
      if (!res.ok) throw new Error("Failed to create player");
      await res.json();
      setName("");
      setRole("");
      onCreated?.();
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h2 className="text-base font-semibold mb-3">Add Player</h2>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-2">
        <input
          className="px-3 py-2 rounded-md border focus:outline-none focus:ring focus:ring-emerald-200"
          placeholder="Player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="px-3 py-2 rounded-md border bg-white focus:outline-none focus:ring focus:ring-emerald-200"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Role (optional)</option>
          <option>Batter</option>
          <option>Bowler</option>
          <option>All-rounder</option>
          <option>Keeper</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center items-center px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Player"}
        </button>
      </form>
    </div>
  );
}
