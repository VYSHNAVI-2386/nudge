import { useState } from "react";
import Navbar from "../components/Navbar";
import { useStore } from "../store/useStore";
import type { Companion } from "../types";

const COMPANIONS = [
  { id: "bear",    src: "/companion-bear.png",    label: "Bear" },
  { id: "bunny",   src: "/companion-bunny.png",   label: "Bunny" },
  { id: "cat",     src: "/companion-cat.png",     label: "Cat" },
  { id: "penguin", src: "/companion-penguin.png", label: "Penguin" },
  { id: "pig",     src: "/companion-pig.png",     label: "Pig" },
  { id: "fox",     src: "/companion-fox.png",     label: "Fox" },
];

const AVATAR_COLORS = [
  "from-pink-200 to-rose-200",
  "from-purple-200 to-fuchsia-200",
  "from-amber-200 to-orange-200",
  "from-sky-200 to-blue-200",
  "from-teal-200 to-emerald-200",
  "from-red-200 to-pink-200",
];

type Step = "list" | "name" | "phone" | "companion" | "done";

export default function Circle() {
  const people = useStore((s) => s.people);
  const addPerson = useStore((s) => s.addPerson);
  const deletePerson = useStore((s) => s.deletePerson);

  const [step, setStep] = useState<Step>("list");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [companion, setCompanion] = useState<Companion>("bear");

  const reset = () => {
    setStep("list");
    setName("");
    setPhone("");
    setCompanion("bear");
  };

  const finish = () => {
    if (!name.trim()) return;
    addPerson({ name: name.trim(), emoji: "🧑", companion });
    setStep("done");
    setTimeout(reset, 1600);
  };

  const initials = (n: string) => n.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-md mx-auto px-5 py-8">

        {/* header */}
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-1">
            <img src="/icon-circle.png" alt="" className="w-8 h-8 object-contain" />
            <h1 className="text-2xl font-black text-gray-700">My Circle</h1>
          </div>
          <p className="text-gray-400 text-sm pl-11">People you send nudges to</p>
        </div>

        {/* people list */}
        <div className="flex flex-col gap-3 mb-6">
          {people.length === 0 && step === "list" && (
            <div className="text-center py-12">
              <img src="/icon-circle.png" alt="" className="w-16 h-16 object-contain mx-auto opacity-30 mb-3" />
              <p className="text-gray-300 text-sm">No one added yet</p>
            </div>
          )}

          {people.map((p, i) => (
            <div key={p.id}
              className="flex items-center gap-4 bg-white border border-pink-50
                rounded-2xl px-4 py-3.5 hover:border-pink-200 hover:shadow-sm
                transition-all duration-200 group">

              {/* avatar */}
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br
                ${AVATAR_COLORS[i % AVATAR_COLORS.length]}
                flex items-center justify-center font-bold text-white text-sm shrink-0`}>
                {initials(p.name)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-700 truncate">{p.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
  <img src={`/companion-${p.companion}.png`} alt="" className="w-6 h-6 object-contain" />
  <span className="text-xs text-gray-300">companion</span>
</div>
              </div>

              <button
                onClick={() => deletePerson(p.id)}
                className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full
                  bg-red-50 hover:bg-red-100 text-red-400 text-xs flex items-center
                  justify-center transition-all duration-200 shrink-0">
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* add flow */}
        {step === "list" && (
          <button
            onClick={() => setStep("name")}
            className="w-full border-2 border-dashed border-pink-200 hover:border-pink-400
              rounded-2xl py-4 text-pink-400 font-semibold text-sm
              hover:bg-pink-50 transition-all duration-200 flex items-center justify-center gap-2">
            <span className="text-lg">+</span> Add someone to your circle
          </button>
        )}

        {/* STEP: name */}
        {step === "name" && (
          <div className="bg-pink-50/60 rounded-3xl p-6 flex flex-col gap-4 border border-pink-100">
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-700">What's their name?</p>
              <button onClick={reset} className="text-gray-300 hover:text-gray-400 text-sm">Cancel</button>
            </div>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Amma, Nanna, Priya..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep("phone")}
              className="w-full px-4 py-3.5 rounded-2xl border border-pink-200
                bg-white text-gray-700 placeholder-gray-300 outline-none
                focus:border-pink-400 text-sm transition-all"
            />
            <button
              disabled={!name.trim()}
              onClick={() => setStep("phone")}
              className="w-full bg-pink-400 hover:bg-pink-500 disabled:opacity-40
                text-white py-3.5 rounded-full font-semibold text-sm
                transition-all active:scale-95">
              Next →
            </button>
          </div>
        )}

        {/* STEP: phone */}
        {step === "phone" && (
          <div className="bg-pink-50/60 rounded-3xl p-6 flex flex-col gap-4 border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-700">Add {name}'s number</p>
                <p className="text-xs text-gray-400 mt-0.5">Optional — for future SMS nudges</p>
              </div>
              <button onClick={reset} className="text-gray-300 hover:text-gray-400 text-sm">Cancel</button>
            </div>
            <input
              autoFocus
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-pink-200
                bg-white text-gray-700 placeholder-gray-300 outline-none
                focus:border-pink-400 text-sm transition-all"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setStep("companion")}
                className="flex-1 bg-pink-400 hover:bg-pink-500
                  text-white py-3.5 rounded-full font-semibold text-sm
                  transition-all active:scale-95">
                Next →
              </button>
              <button
                onClick={() => setStep("companion")}
                className="flex-1 bg-white border border-pink-200 hover:bg-pink-50
                  text-gray-400 py-3.5 rounded-full font-semibold text-sm
                  transition-all active:scale-95">
                Skip
              </button>
            </div>
          </div>
        )}

        {/* STEP: companion */}
        {step === "companion" && (
          <div className="bg-pink-50/60 rounded-3xl p-6 flex flex-col gap-4 border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-700">{name}'s companion</p>
                <p className="text-xs text-gray-400 mt-0.5">This character will deliver the nudges</p>
              </div>
              <button onClick={reset} className="text-gray-300 hover:text-gray-400 text-sm">Cancel</button>
            </div>

            <div className="grid grid-cols-3 gap-2">
  {COMPANIONS.map((c) => (
    <button key={c.id}
      onClick={() => setCompanion(c.id)}
      className={`flex flex-col items-center gap-1 p-4 rounded-2xl transition-all duration-200
        ${companion === c.id
          ? "bg-pink-400 scale-105 shadow-md"
          : "bg-white border border-pink-100 hover:border-pink-300"}`}>
      <img src={c.src} alt={c.label} className="w-12 h-12 object-contain" />
      <span className={`text-xs font-medium ${companion === c.id ? "text-white" : "text-gray-400"}`}>
        {c.label}
      </span>
    </button>
  ))}
</div>

            <button
              onClick={finish}
              className="w-full bg-pink-400 hover:bg-pink-500 active:scale-95
                text-white py-3.5 rounded-full font-bold text-sm
                shadow-md shadow-pink-200 transition-all">
              Add {name} to my circle 💛
            </button>
          </div>
        )}

        {/* STEP: done */}
        {step === "done" && (
          <div className="flex flex-col items-center gap-3 py-6 animate-fade-in">
             <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
      <img src={`/companion-${companion}.png`} alt="" className="w-16 h-16 object-contain" />
    </div>
            <p className="font-bold text-gray-700">{name} added! 🌸</p>
          </div>
        )}
      </div>
    </div>
  );
}
