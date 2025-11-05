import { useEffect } from "react";
import { Download, RefreshCw } from "lucide-react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function PlayerList({ players, onRefresh, onSelect }) {
  useEffect(() => {
    if (!players) onRefresh?.();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <h2 className="text-base font-semibold">Players</h2>
        <button onClick={onRefresh} className="text-sm inline-flex items-center gap-1 px-2 py-1 rounded-md border hover:bg-gray-100">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      <div className="divide-y">
        {(players || []).map((p) => (
          <div key={p._id} className="p-4 flex flex-wrap items-center gap-3 justify-between">
            <div className="min-w-0">
              <p className="font-medium truncate">{p.name} <span className="text-xs text-gray-500">{p.role || ''}</span></p>
              <p className="text-xs text-gray-600">Runs {p.total_runs} • Balls {p.total_balls} • 4s {p.total_fours} • 6s {p.total_sixes} • SR {p.strike_rate}</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`${API_BASE}/players/${p._id}/export?format=csv`}
                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 text-sm"
              >
                <Download size={16} /> CSV
              </a>
              <a
                href={`${API_BASE}/players/${p._id}/export?format=json`}
                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 text-sm"
              >
                <Download size={16} /> JSON
              </a>
              <button
                onClick={() => onSelect?.(p)}
                className="px-2 py-1 rounded-md text-sm bg-emerald-600 text-white hover:bg-emerald-700"
              >
                View
              </button>
            </div>
          </div>
        ))}
        {!players?.length && (
          <div className="p-6 text-center text-sm text-gray-500">No players yet. Add a player to get started.</div>
        )}
      </div>
    </div>
  );
}
