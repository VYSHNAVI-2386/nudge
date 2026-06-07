import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";

type Sheet = null | "notifications" | "privacy" | "help";

export default function Profile() {
  const reminders = useStore((s) => s.reminders);
  const people = useStore((s) => s.people);
  const done = reminders.filter((r) => r.done).length;
  const navigate = useNavigate();
  const { permission, requestPermission } = useNotifications();

  const user = JSON.parse(localStorage.getItem("nudge-user") ?? "{}");
  const isGuest = !user.email;

  const [avatar, setAvatar] = useState<string | null>(localStorage.getItem("nudge-avatar"));
  const [sheet, setSheet] = useState<Sheet>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatar(result);
      localStorage.setItem("nudge-avatar", result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem("nudge-token");
    localStorage.removeItem("nudge-refresh");
    localStorage.removeItem("nudge-user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-sm mx-auto px-5 pt-10 pb-4 flex flex-col items-center gap-6">

        {/* guest banner */}
        {isGuest && (
          <div className="w-full bg-pink-50 border border-pink-200 rounded-2xl px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-pink-500 font-medium">You're browsing as a guest</p>
            <button onClick={() => navigate("/login")}
              className="text-xs bg-pink-400 text-white px-3 py-1.5 rounded-full font-semibold">
              Sign up
            </button>
          </div>
        )}

        {/* avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-pink-100 overflow-hidden ring-4 ring-pink-50">
            {avatar
              ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-4xl">🐻</div>
            }
          </div>
          <button onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-pink-400
              hover:bg-pink-500 text-white text-lg flex items-center justify-center
              shadow-md transition-all active:scale-90 leading-none">
            +
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
        </div>

        {/* name */}
        <div className="text-center">
          <h1 className="text-xl font-black text-gray-700">{user.name ?? "Guest User"}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{user.email ?? "Not signed in"}</p>
        </div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {[
            { label: "Reminders", value: reminders.length, icon: "⏰" },
            { label: "Circle", value: people.length, icon: "💛" },
            { label: "Done", value: done, icon: "✓" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-pink-50 rounded-2xl p-4 text-center">
              <div className="text-xl">{icon}</div>
              <div className="text-2xl font-black text-gray-700 mt-1">{value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* menu */}
        <div className="w-full bg-white rounded-3xl border border-pink-50 overflow-hidden">
          {[
            { icon: "🔔", label: "Notifications", key: "notifications" },
            { icon: "🔒", label: "Privacy", key: "privacy" },
            { icon: "❓", label: "Help & Support", key: "help" },
          ].map(({ icon, label, key }) => (
            <button key={key}
              onClick={() => setSheet(key as Sheet)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-pink-50
                transition-colors border-b border-pink-50 last:border-0 text-left group">
              <span className="text-lg">{icon}</span>
              <span className="flex-1 text-gray-600 text-sm font-semibold">{label}</span>
              <span className="text-gray-300 group-hover:text-pink-400 transition-colors">›</span>
            </button>
          ))}
        </div>

        {!isGuest && (
          <button onClick={handleLogout}
            className="w-full border border-red-100 hover:bg-red-50 text-red-400
              py-3.5 rounded-full font-semibold text-sm transition-all active:scale-95">
            Log out
          </button>
        )}

        <p className="text-xs text-gray-200">Nudge · Made with 💛 by Vyshnavi © 2026</p>
      </div>

      {/* BOTTOM SHEET */}
      {sheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSheet(null)} />
          <div className="relative w-full max-w-md bg-white rounded-t-[28px] p-6 pb-10 shadow-2xl animate-slide-up">

            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

            {sheet === "notifications" && (
              <>
                <h2 className="text-lg font-black text-gray-700 mb-4">🔔 Notifications</h2>
                <div className="flex items-center justify-between p-4 bg-pink-50 rounded-2xl mb-3">
                  <div>
                    <p className="font-semibold text-gray-700 text-sm">Push notifications</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {permission === "granted" ? "Enabled ✓" : permission === "denied" ? "Blocked — enable in browser settings" : "Not yet enabled"}
                    </p>
                  </div>
                  {permission !== "granted" && permission !== "denied" && (
                    <button onClick={() => requestPermission()}
                      className="bg-pink-400 text-white text-xs px-3 py-2 rounded-full font-semibold">
                      Enable
                    </button>
                  )}
                  {permission === "granted" && (
                    <span className="text-green-500 text-xl">✓</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 px-1">
                  Nudge uses notifications to remind your loved ones at the scheduled time — even when the app is in the background.
                </p>
              </>
            )}

            {sheet === "privacy" && (
              <>
                <h2 className="text-lg font-black text-gray-700 mb-4">🔒 Privacy</h2>
                {[
                  { title: "Your data", desc: "Reminders and circle members are stored securely in our database and never shared with third parties." },
                  { title: "Local storage", desc: "Your session and profile picture are stored locally on your device only." },
                  { title: "Notifications", desc: "Notification content stays on your device. We don't read or log what nudges you send." },
                ].map(({ title, desc }) => (
                  <div key={title} className="mb-4 p-4 bg-pink-50 rounded-2xl">
                    <p className="font-semibold text-gray-700 text-sm mb-1">{title}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </>
            )}

            {sheet === "help" && (
              <>
                <h2 className="text-lg font-black text-gray-700 mb-4">❓ Help & Support</h2>
                {[
                  { q: "How do reminders work?", a: "Add a reminder with a time and it will fire a notification and popup at that exact time every day (or on your chosen repeat schedule)." },
                  { q: "Can I add people who don't have the app?", a: "Yes! Add them to your circle with their name and phone number. Future versions will support SMS nudges to non-app users." },
                  { q: "Why am I not getting notifications?", a: "Make sure notifications are enabled in the Notifications settings above, and that your browser has permission. On iPhone, use Safari and 'Add to Home Screen' first." },
                  { q: "How do I install the app on my phone?", a: "Open the app in your browser, tap Share → Add to Home Screen (iOS) or tap the install prompt (Android). It works like a native app!" },
                ].map(({ q, a }) => (
                  <div key={q} className="mb-4 p-4 bg-pink-50 rounded-2xl">
                    <p className="font-semibold text-gray-700 text-sm mb-1">{q}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{a}</p>
                  </div>
                ))}
                <p className="text-xs text-center text-gray-300 mt-2">
                  Still stuck? Email us at hello@nudgeapp.in
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
