import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

type Mode = "login" | "signup";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        const data = await api.auth.login(email, password);
        localStorage.setItem("nudge-token", data.accessToken);
        localStorage.setItem("nudge-refresh", data.refreshToken);
        localStorage.setItem("nudge-user", JSON.stringify(data.user));
      } else {
        if (!name) { setError("Name is required"); setLoading(false); return; }
        const data = await api.auth.register(name, email, password);
        localStorage.setItem("nudge-token", data.accessToken);
        localStorage.setItem("nudge-refresh", data.refreshToken);
        localStorage.setItem("nudge-user", JSON.stringify(data.user));
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-rose-100 rounded-full blur-3xl opacity-40 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative w-full max-w-sm flex flex-col items-center gap-7">
        <img src="/logo-nudge.png" alt="Nudge" className="w-36 h-auto" />

        <div className="w-full bg-white rounded-[28px] border border-pink-100 shadow-xl shadow-pink-50 p-7">
          <div className="flex bg-pink-50 rounded-full p-1 mb-6">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
                  ${mode === m ? "bg-pink-400 text-white shadow-md" : "text-gray-400"}`}>
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {mode === "signup" && (
              <input type="text" placeholder="Your name" value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-pink-100 bg-pink-50/40 text-gray-700 placeholder-gray-300 outline-none focus:border-pink-300 transition-all text-sm" />
            )}
            <input type="email" placeholder="Email address" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-pink-100 bg-pink-50/40 text-gray-700 placeholder-gray-300 outline-none focus:border-pink-300 transition-all text-sm" />
            <input type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-4 py-3.5 rounded-2xl border border-pink-100 bg-pink-50/40 text-gray-700 placeholder-gray-300 outline-none focus:border-pink-300 transition-all text-sm" />

            {error && (
              <p className="text-xs text-red-400 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
            )}

            {mode === "login" && (
              <p className="text-right text-xs text-pink-400 cursor-pointer hover:text-pink-500">
                Forgot password?
              </p>
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-pink-400 hover:bg-pink-500 active:scale-95 disabled:opacity-60 text-white py-4 rounded-full font-bold shadow-lg shadow-pink-200 transition-all duration-200 mt-1">
              {loading ? "..." : mode === "login" ? "Log in 💛" : "Create account 🌸"}
            </button>
          </div>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-pink-100" />
            <span className="text-xs text-gray-300">or</span>
            <div className="flex-1 h-px bg-pink-100" />
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center justify-center gap-3 border border-pink-100 hover:border-pink-200 hover:bg-pink-50/50 bg-white rounded-full py-3.5 text-sm font-semibold text-gray-500 transition-all duration-200 active:scale-95">
            Continue as guest
          </button>
        </div>

        <p className="text-xs text-gray-300 text-center">
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}