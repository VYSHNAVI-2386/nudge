import { useState } from "react";
import { useStore } from "../store/useStore";
import type { Companion, RepeatMode } from "../types";

const COMPANIONS = [
  { id: "bear",    src: "/companion-bear.png",    label: "Bear" },
  { id: "bunny",   src: "/companion-bunny.png",   label: "Bunny" },
  { id: "cat",     src: "/companion-cat.png",     label: "Cat" },
  { id: "penguin", src: "/companion-penguin.png", label: "Penguin" },
  { id: "pig",     src: "/companion-pig.png",     label: "Pig" },
  { id: "fox",     src: "/companion-fox.png",     label: "Fox" },
];

// ✅ COMPANIONS is fine here — it's just a plain array, not a hook

const REPEATS: RepeatMode[] = ["once", "daily", "weekdays", "weekly"];
const QUICK_MSGS = [
  { icon: "💊", label: "Meds", text: "Time for your meds! Don't forget ok 💊" },
  { icon: "🍱", label: "Meal", text: "Have you eaten yet? Please eat something!" },
  { icon: "💧", label: "Water", text: "Drink some water, okay? Stay hydrated!" },
  { icon: "😴", label: "Rest", text: "Rest time! Please lie down for a bit 🌙" },
];

type Props = { onClose: () => void };

export default function AddReminderModal({ onClose }: Props) {
  const people = useStore((s) => s.people);
  const addReminder = useStore((s) => s.addReminder);

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("14:00");
  const [companion, setCompanion] = useState<Companion>("bear"); // ✅ "bear" not "🐻"
  const [repeat, setRepeat] = useState<RepeatMode>("daily");
  const [recipient, setRecipient] = useState(people[0]?.name ?? "");
  const [message, setMessage] = useState("");

  const save = () => {
    if (!title || !time || !recipient) return;
    addReminder({ title, time, companion, repeat, recipient, message: message || title });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0">
      <div className="bg-white w-full max-w-md rounded-[28px] p-6 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">

        {/* header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-400">
            New Reminder ✨
          </h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* title */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Reminder</label>
            <input
              type="text"
              placeholder="e.g. Take Medicine"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1.5 p-3.5 rounded-2xl border border-pink-100 bg-pink-50/40 outline-none focus:border-pink-300 focus:bg-white text-gray-700 placeholder-gray-300 transition-all"
            />
          </div>

          {/* recipient */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Who is this for?</label>
            <div className="flex gap-2 mt-1.5 flex-wrap">
              {people.map((p) => (
                <button key={p.id}
                  onClick={() => setRecipient(p.name)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${recipient === p.name
                      ? "bg-pink-400 text-white shadow-md shadow-pink-200"
                      : "bg-pink-50 text-gray-500 hover:bg-pink-100"}`}>
                  <span>{p.emoji}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* message */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Message</label>
            <div className="flex gap-2 mt-1.5 mb-2 flex-wrap">
              {QUICK_MSGS.map((q) => (
                <button key={q.label}
                  onClick={() => setMessage(q.text)}
                  className="text-xs bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-500 px-3 py-1.5 rounded-full font-medium transition-colors">
                  {q.icon} {q.label}
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              placeholder="Write something warm..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-pink-100 bg-pink-50/40 outline-none focus:border-pink-300 focus:bg-white text-gray-700 placeholder-gray-300 transition-all resize-none text-sm"
            />
          </div>

          {/* time + repeat */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full mt-1.5 p-3.5 rounded-2xl border border-pink-100 bg-pink-50/40 outline-none focus:border-pink-300 text-gray-700 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Repeat</label>
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as RepeatMode)}
                className="w-full mt-1.5 p-3.5 rounded-2xl border border-pink-100 bg-pink-50/40 outline-none focus:border-pink-300 text-gray-700 transition-all">
                {REPEATS.map((r) => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* companion */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Companion</label>
            <div className="flex gap-2 mt-1.5">
              {COMPANIONS.map((c) => (
                <button key={c.id}
                  onClick={() => setCompanion(c.id)}
                  className={`p-1.5 rounded-2xl transition-all duration-200
                    ${companion === c.id
                      ? "bg-pink-100 scale-110 shadow-md"
                      : "bg-pink-50 hover:bg-pink-100 hover:scale-105"}`}>
                  <img src={c.src} alt={c.label} className="w-12 h-12 object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={save}
              disabled={!title || !recipient}
              className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 disabled:opacity-40 text-white py-3.5 rounded-2xl font-semibold transition-all shadow-md shadow-pink-200 active:scale-95">
              Save Reminder 🌸
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3.5 rounded-2xl font-semibold transition-all active:scale-95">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}