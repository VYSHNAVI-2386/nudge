import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: "/dashboard", icon: "/icon-home.png",    label: "Home" },
    { to: "/circle",    icon: "/icon-circle.png",  label: "Circle" },
    { to: "/history",   icon: "/icon-history.png", label: "History" },
    { to: "/profile",   icon: "/icon-profile.png", label: "Profile" },
  ];

  return (
    <>
      {/* spacer so content doesn't hide behind navbar */}
      <div className="h-20" />

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md
        border-t border-pink-50 flex items-center justify-around px-2 py-2
        shadow-[0_-4px_20px_rgba(236,72,153,0.08)]">

        {/* Home */}
        <NavItem to={links[0].to} icon={links[0].icon} label={links[0].label} active={pathname === links[0].to} />

        {/* Circle */}
        <NavItem to={links[1].to} icon={links[1].icon} label={links[1].label} active={pathname === links[1].to} />

        {/* Center CREATE button */}
        <Link to="/dashboard?add=true"
          className="flex flex-col items-center -mt-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-400
            flex items-center justify-center shadow-lg shadow-pink-300
            hover:scale-105 active:scale-95 transition-all duration-200">
            <span className="text-white text-3xl font-light leading-none mb-0.5">+</span>
          </div>
          <span className="text-[10px] font-semibold text-pink-400 mt-1">Add</span>
        </Link>

        {/* History */}
        <NavItem to={links[2].to} icon={links[2].icon} label={links[2].label} active={pathname === links[2].to} />

        {/* Profile */}
        <NavItem to={links[3].to} icon={links[3].icon} label={links[3].label} active={pathname === links[3].to} />
      </nav>
    </>
  );
}

function NavItem({ to, icon, label, active }: { to: string; icon: string; label: string; active: boolean }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl transition-all duration-200">
      <img
        src={icon}
        alt={label}
        className={`w-6 h-6 object-contain transition-all duration-200
          ${active ? "scale-110" : "opacity-40"}`}
      />
      <span className={`text-[10px] font-semibold transition-colors duration-200
        ${active ? "text-pink-400" : "text-gray-300"}`}>
        {label}
      </span>
    </Link>
  );
}
