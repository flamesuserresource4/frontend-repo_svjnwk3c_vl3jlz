import { Trophy } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
          <Trophy size={20} />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Cricket Scorecard</h1>
          <p className="text-xs text-gray-500">Track innings, boundaries, and career strike rate</p>
        </div>
      </div>
    </header>
  );
}
