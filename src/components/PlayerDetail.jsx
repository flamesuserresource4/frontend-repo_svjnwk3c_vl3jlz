import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function PlayerDetail({ player, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/players/${player._id}`);
        const json = await res.json();
        if (active) setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    }
    if (player) load();
    return () => {
      active = false;
    };
  }, [player]);

  if (!player) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{player.name}</h3>
            <p className="text-xs text-gray-500">Career: Runs {data?.career.total_runs || 0} • SR {data?.career.strike_rate || 0}</p>
          </div>
          <button onClick={onClose} className="px-2 py-1 text-sm rounded-md border hover:bg-gray-50">Close</button>
        </div>
        <div className="max-h-[70vh] overflow-auto divide-y">
          {loading && <div className="p-6 text-center text-gray-500">Loading...</div>}
          {!loading && !data?.innings?.length && (
            <div className="p-6 text-center text-gray-500">No innings yet.</div>
          )}
          {data?.innings?.map((inn) => (
            <div key={inn._id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{inn.runs} ({inn.balls}) • 4s {inn.fours} • 6s {inn.sixes} • SR {inn.strike_rate}</p>
                <p className="text-xs text-gray-500">{inn.date?.slice(0,10) || ''} {inn.opposition ? `vs ${inn.opposition}` : ''} {inn.venue ? `@ ${inn.venue}` : ''}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${inn.out ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{inn.out ? 'Out' : 'Not Out'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
