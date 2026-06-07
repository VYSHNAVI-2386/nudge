import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Reminder, Person, Companion } from "../types";

type Store = {
  reminders: Reminder[];
  people: Person[];
  addReminder: (r: Omit<Reminder, "id" | "createdAt" | "done">) => void;
  deleteReminder: (id: string) => void;
  markDone: (id: string) => void;
  addPerson: (p: Omit<Person, "id">) => void;
  deletePerson: (id: string) => void;
};
export const useStore = create<Store>()(
  persist(
    (set) => ({
      reminders: [
        {
          id: "1",
          title: "Take Medicine",
          time: "14:00",
          companion: "bear" as Companion,
          repeat: "daily",
          recipient: "Amma",
          message: "Time for your afternoon meds! Don't forget ok 💊",
          createdAt: new Date().toISOString(),
          done: false,
        },
        {
          id: "2",
          title: "Drink Water",
          time: "12:00",
          companion: "cat" as Companion,
          repeat: "daily",
          recipient: "Nanna",
          message: "Drink some water, okay? Staying hydrated 💧",
          createdAt: new Date().toISOString(),
          done: false,
        },
      ],
      people: [
        { id: "1", name: "Amma", emoji: "🧓", companion: "bear" },
        { id: "2", name: "Nanna", emoji: "👴", companion: "cat" },
        { id: "3", name: "Priya", emoji: "👩", companion: "bunny" },
      ],
      addReminder: (r) =>
        set((s) => ({
          reminders: [
            ...s.reminders,
            {
              ...r,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              done: false,
            },
          ],
        })),
      deleteReminder: (id) =>
        set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) })),
      markDone: (id) =>
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id ? { ...r, done: true } : r
          ),
        })),
      addPerson: (p) =>
        set((s) => ({
          people: [...s.people, { ...p, id: crypto.randomUUID() }],
        })),
      deletePerson: (id) =>
        set((s) => ({ people: s.people.filter((p) => p.id !== id) })),
    }),
    { name: "nudge-store" }
  )
);