
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "▦", end: true },
  { to: "/admin/qr", label: "QR Code", icon: "▣" },
  { to: "/admin/customers", label: "Customers", icon: "♙" },
  { to: "/admin/payments", label: "Payments", icon: "₹" },
  { to: "/admin/advertisements", label: "Advertisements", icon: "✧" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7F1]">

      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col bg-[#174D38] px-5 py-7 text-white">

        {/* Brand */}
        <div className="mb-10 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-lg font-extrabold text-[#174D38]">
              GB
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Green Basket
              </h1>
              <p className="text-xs text-green-200">Mart</p>
            </div>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-green-200">
            Admin Panel
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-green-300">
            Main Menu
          </p>

          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#174D38] shadow-md"
                    : "text-green-100 hover:bg-[#245D43] hover:text-white"
                }`
              }
            >
              <span className="grid h-7 w-7 place-items-center text-xl">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 pt-5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-white/20 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-[#245D43]"
          >
            <span className="text-lg">↪</span>
            Log out
          </button>

          <p className="mt-5 text-center text-xs text-green-300">
            Scan & Connect © 2026
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex-1">

        {/* Top Header */}
        <header className="sticky top-0 z-10 border-b border-[#E3E9DF] bg-white px-5 py-5 shadow-sm sm:px-8">
          <h2 className="text-xl font-bold text-[#174D38]">
            Green Basket Mart
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Smart Retail Engagement System
          </p>
        </header>

        {/* Page Content */}
        <main className="p-5 sm:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
