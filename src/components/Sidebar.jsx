import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="fixed top-4 left-4 z-50 rounded-lg bg-zinc-800 p-2 text-white md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
    fixed top-0 left-0 z-40 min-h-screen w-64 bg-zinc-800 text-white p-5
    transform transition-transform duration-300 ease-in-out
    md:sticky md:top-0 md:h-screen md:translate-x-0
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        <h1 className="mb-8 text-center text-2xl font-bold">Anvaya CRM</h1>
        <nav className="flex flex-col gap-2">
          {[
            { to: "/", label: "Dashboard" },
            { to: "/leads", label: "Leads" },
            { to: "/agents", label: "Agents" },
            { to: "/reports", label: "Reports" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `text-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive ? "bg-emerald-600" : "hover:bg-zinc-700"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
