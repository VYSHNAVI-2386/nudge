import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { useNotifications } from "./useNotifications";
import type { Reminder } from "../types";

export function useScheduler() {
  const reminders = useStore((s) => s.reminders);
  const [triggered, setTriggered] = useState<Reminder | null>(null);
  const { sendNotification, permission, requestPermission } = useNotifications();

  useEffect(() => {
    if (permission === "default") requestPermission();
  }, []);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${hh}:${mm}`;
      const match = reminders.find((r) => r.time === currentTime && !r.done);
      if (match) {
        setTriggered(match);
        sendNotification(`Hey! Time to nudge 💛`, match.message, match.companion);
      }
    };

    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, [reminders, permission]);

  return { triggered, clearTriggered: () => setTriggered(null) };
}