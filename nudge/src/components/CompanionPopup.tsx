import { useEffect, useState } from "react";

type Props = {
  showPopup: boolean;
  message: string;
  companion: string;
  senderName?: string;
  onClose: () => void;
  onDone?: () => void;
};

export default function CompanionPopup({
  showPopup,
  message,
  companion,
  senderName = "Someone special",
  onClose,
  onDone,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (showPopup) {
      setLeaving(false);
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [showPopup]);

  const dismiss = (action: "done" | "snooze") => {
    setLeaving(true);
    setTimeout(() => {
      if (action === "done" && onDone) onDone();
      onClose();
      setLeaving(false);
    }, 350);
  };

  if (!showPopup) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center px-4
      transition-all duration-300
      ${visible && !leaving ? "bg-black/25 backdrop-blur-sm" : "bg-transparent"}`}>

      <div className={`bg-white w-full max-w-sm rounded-[32px] p-7 shadow-2xl relative overflow-hidden
        transition-all duration-350
        ${visible && !leaving
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
        }`}>

        {/* soft bg blobs */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-fuchsia-100 rounded-full blur-2xl opacity-60" />

        {/* sound waves */}
        <div className="flex items-end justify-center gap-0.5 mb-5 relative z-10">
          {[3, 5, 8, 11, 8, 5, 3].map((h, i) => (
            <div key={i}
              className="w-1 bg-pink-300 rounded-full animate-soundwave"
              style={{
                height: `${h * 2}px`,
                animationDelay: `${i * 0.08}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
          <span className="ml-2 text-xs text-pink-300 self-center">gentle chime ♪</span>
        </div>

        {/* companion */}
        <div className="flex justify-center relative z-10">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-50 to-rose-50
  flex items-center justify-center shadow-inner
  animate-bounce-gentle ring-4 ring-pink-100">
  <img
    src={`/companion-${companion}.png`}
    alt="companion"
    className="w-20 h-20 object-contain"
  />
</div>
            <span className="absolute -top-1 -right-1 text-xl animate-spin-slow">✨</span>
          </div>
        </div>

        {/* from label */}
        <div className="flex justify-center mt-4 relative z-10">
          <span className="bg-pink-50 text-pink-400 text-xs font-semibold px-3 py-1 rounded-full">
            From {senderName} 💛
          </span>
        </div>

        {/* text */}
        <div className="text-center mt-4 relative z-10">
          <h2 className="text-2xl font-black text-gray-700">A gentle nudge 💌</h2>
          <p className="text-gray-400 mt-2 leading-relaxed text-base">{message}</p>
        </div>

        {/* buttons */}
        <div className="flex gap-3 mt-7 relative z-10">
          <button
            onClick={() => dismiss("done")}
            className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500
              text-white py-3.5 rounded-2xl font-semibold transition-all duration-200
              shadow-md shadow-pink-200 active:scale-95"
          >
            ✓ Done
          </button>
          <button
            onClick={() => dismiss("snooze")}
            className="flex-1 bg-pink-50 hover:bg-pink-100 text-pink-400
              py-3.5 rounded-2xl font-semibold transition-all duration-200 active:scale-95"
          >
            Snooze 10m
          </button>
        </div>
      </div>
    </div>
  );
}
