import { useState } from "react";
import Navbar from "../components/Navbar";
import { useStore } from "../store/useStore";

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

type Filter = "all" | "done" | "pending";

export default function History() {
  const reminders = useStore((s) => s.reminders);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = [...reminders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .filter((r) => {
      if (filter === "done") return r.done;
      if (filter === "pending") return !r.done;
      return true;
    });

  // group by date
  const grouped = filtered.reduce<Record<string, typeof reminders>>((acc, r) => {
    const key = formatDate(r.createdAt);
    acc[key] = acc[key] ? [...acc[key], r] : [r];
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-md mx-auto px-5 py-8">

        {/* header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <img src="/icon-history.png" alt="" className="w-8 h-8 object-contain" />
            <h1 className="text-2xl font-black text-gray-700">History</h1>
          </div>
          <p className="text-gray-400 text-sm pl-11">All your scheduled nudges</p>
        </div>

        {/* filter pills */}
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "done"] as Filter[]).map((f) => (
            <button key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                ${filter === f
                  ? "bg-pink-400 text-white shadow-sm"
                  : "bg-pink-50 text-gray-400 hover:bg-pink-100"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-300 self-center">
            {filtered.length} nudge{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* empty */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <img src="/icon-history.png" alt="" className="w-14 h-14 object-contain mx-auto opacity-20 mb-4" />
            <p className="text-gray-300 text-sm">Nothing here yet</p>
          </div>
        )}

        {/* grouped list */}
        <div className="flex flex-col gap-5">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 px-1">
                {date}
              </p>
              <div className="flex flex-col gap-2">
                {items.map((r) => (
                  <div key={r.id}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border
                      transition-all duration-200
                      ${r.done
                        ? "bg-green-50/60 border-green-100"
                        : "bg-white border-pink-50 hover:border-pink-200"}`}>

                    <img src={`/companion-${r.companion}.png`} alt="" className="w-8 h-8 object-contain shrink-0" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold text-sm truncate
                          ${r.done ? "text-gray-400 line-through" : "text-gray-700"}`}>
                          {r.title}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        To {r.recipient} · {formatTime(r.time)}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {r.done
                        ? <span className="text-xs bg-green-100 text-green-500 px-2 py-1 rounded-full font-medium">✓</span>
                        : <span className="text-xs bg-pink-100 text-pink-400 px-2 py-1 rounded-full font-medium capitalize">{r.repeat}</span>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
