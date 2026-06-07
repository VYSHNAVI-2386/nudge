import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Welcome from "../components/Welcome";

export default function Home() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("nudge-seen");
  });

  useEffect(() => {
    if (showSplash) {
      const t = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("nudge-seen", "1");
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [showSplash]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Welcome show={showSplash} />

      {/* hero — full center */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-8">

        <img src="/logo-nudge.png" alt="Nudge" className="w-50 h-auto" />

        <p className="text-gray-400 text-lg max-w-xs leading-relaxed">
          Send soft, warm reminders to the people you love even when life gets busy.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link to="/login">
            <button className="w-full bg-pink-400 hover:bg-pink-500 active:scale-95
              text-white py-4 rounded-full text-base font-bold shadow-lg shadow-pink-200
              transition-all duration-200">
              Get started
            </button>
          </Link>
          <Link to="/dashboard">
            <button className="w-full bg-pink-50 hover:bg-pink-100 active:scale-95
              text-pink-400 py-4 rounded-full text-base font-semibold
              transition-all duration-200">
              Continue as guest
            </button>
          </Link>
        </div>

        {/* companion row */}
        <div className="flex gap-3 text-3xl opacity-40 mt-2">
          {["🐻","🐰","🐱","🐧","🦊"].map((c, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.2}s` }}
              className="animate-bounce" >{c}</span>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-200 pb-6">Made with 💛 by Vyshnavi &copy; 2026</p>
    </div>
  );
}
