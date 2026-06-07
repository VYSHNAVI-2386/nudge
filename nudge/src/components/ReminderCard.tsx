import type { Reminder } from "../types";

const COMPANION_COLORS: Record<string, string> = {
  bear:    "from-amber-50 to-orange-50 border-amber-100",
  cat:     "from-purple-50 to-fuchsia-50 border-purple-100",
  bunny:   "from-pink-50 to-rose-50 border-pink-100",
  penguin: "from-sky-50 to-blue-50 border-sky-100",
  pig:     "from-rose-50 to-pink-50 border-rose-100",
  fox:     "from-orange-50 to-amber-50 border-orange-100",
};

const REPEAT_LABEL: Record<string, string> = {
  once: "Once",
  daily: "Daily",
  weekdays: "Weekdays",
  weekly: "Weekly",
};

type Props = {
  reminder: Reminder;
  onDelete: () => void;
  onPreview: () => void;
};

function formatTime(time24: string) {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function ReminderCard({ reminder, onDelete, onPreview }: Props) {
  const gradient = COMPANION_COLORS[reminder.companion] ?? "from-pink-50 to-rose-50 border-pink-100";

  return (
    <div className={`bg-gradient-to-br ${gradient} border rounded-3xl p-5
      hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group`}>

      <div className="flex items-start justify-between gap-3">
        {/* left */}
        <div className="flex items-center gap-4">
          <button
  onClick={onPreview}
  className="hover:scale-110 transition-transform duration-200 active:scale-95"
  title="Preview popup"
>
  <img
    src={`/companion-${reminder.companion}.png`}
    alt="companion"
    className="w-14 h-14 object-contain"
  />
</button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-700 text-lg leading-tight">{reminder.title}</h2>
              {reminder.done && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                  ✓ Done
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">To {reminder.recipient}</p>
            <p className="text-gray-400 text-sm mt-1 line-clamp-1 max-w-[180px]">{reminder.message}</p>
          </div>
        </div>

        {/* right */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 text-xs bg-red-50 hover:bg-red-100
              text-red-400 px-2.5 py-1.5 rounded-full transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>

      {/* footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/60">
        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
          <span>⏰</span>
          <span className="font-semibold text-gray-600">{formatTime(reminder.time)}</span>
        </div>
        <span className="text-xs bg-white/70 text-gray-500 px-2.5 py-1 rounded-full font-medium">
          {REPEAT_LABEL[reminder.repeat]}
        </span>
      </div>
    </div>
  );
}
