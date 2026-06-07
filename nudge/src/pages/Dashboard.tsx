import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ReminderCard from "../components/ReminderCard";
import CompanionPopup from "../components/CompanionPopup";
import AddReminderModal from "../components/AddReminderModal";
import { useStore } from "../store/useStore";
import { useScheduler } from "../hooks/useScheduler";
import type { Reminder } from "../types";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAddModal, setShowAddModal] = useState(searchParams.get("add") === "true");
  const [previewReminder, setPreviewReminder] = useState<Reminder | null>(null);

  const reminders = useStore((s) => s.reminders);
  const deleteReminder = useStore((s) => s.deleteReminder);
  const markDone = useStore((s) => s.markDone);

  const { triggered, clearTriggered } = useScheduler();

  useEffect(() => {
    if (triggered) setPreviewReminder(triggered);
  }, [triggered]);

  // clear ?add=true from url after opening modal
  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setShowAddModal(true);
      setSearchParams({});
    }
  }, [searchParams]);

  const active = reminders.filter((r) => !r.done);
  const done = reminders.filter((r) => r.done);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const user = JSON.parse(localStorage.getItem("nudge-user") ?? "{}");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-xl mx-auto px-5 pt-8">

        {/* greeting */}
        <div className="mb-8">
          <p className="text-gray-400 text-sm">{greeting} 👋</p>
          <h1 className="text-2xl font-black text-gray-700 mt-0.5">
            {user.name ? `Hey ${user.name.split(" ")[0]}!` : "Today's Nudges"}
          </h1>
          {reminders.length > 0 && (
            <p className="text-gray-400 text-sm mt-1">
              {active.length} upcoming · {done.length} done
            </p>
          )}
        </div>

        {/* empty state */}
        {reminders.length === 0 && (
          <div className="flex flex-col items-center text-center py-16 gap-4">
            <img src="/logo-nudge.png" alt="" className="w-28 h-auto opacity-50" />
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              No nudges yet. Tap the <span className="text-pink-400 font-bold">+</span> below to add your first reminder for someone you love 💛
            </p>
          </div>
        )}

        {/* active reminders */}
        {active.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-3">
              Upcoming · {active.length}
            </p>
            <div className="flex flex-col gap-3">
              {active.map((r) => (
                <ReminderCard
                  key={r.id}
                  reminder={r}
                  onDelete={() => deleteReminder(r.id)}
                  onPreview={() => setPreviewReminder(r)}
                />
              ))}
            </div>
          </div>
        )}

        {/* done */}
        {done.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-3">
              Done today · {done.length}
            </p>
            <div className="flex flex-col gap-3 opacity-50">
              {done.map((r) => (
                <ReminderCard
                  key={r.id}
                  reminder={r}
                  onDelete={() => deleteReminder(r.id)}
                  onPreview={() => setPreviewReminder(r)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showAddModal && <AddReminderModal onClose={() => setShowAddModal(false)} />}

      <CompanionPopup
        showPopup={!!previewReminder}
        companion={previewReminder?.companion ?? "bear"}
        message={previewReminder?.message ?? ""}
        senderName="You"
        onClose={() => { setPreviewReminder(null); clearTriggered(); }}
        onDone={() => { if (previewReminder) markDone(previewReminder.id); }}
      />
    </div>
  );
}
