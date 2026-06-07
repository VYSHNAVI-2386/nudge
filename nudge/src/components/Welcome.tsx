type WelcomeProps = { show: boolean };

export default function Welcome({ show }: WelcomeProps) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center
        bg-white transition-all duration-700
        ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2" />

      <div className="relative flex flex-col items-center gap-4">
        <img
          src="/logo-nudge.png"
          alt="Nudge"
          className="w-56 h-auto"
        />
        <p className="text-pink-300 text-sm font-medium tracking-widest uppercase">
          Small reminders. Big care.
        </p>
      </div>
    </div>
  );
}
