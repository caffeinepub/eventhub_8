import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  Clock,
  LayoutDashboard,
  LogOut,
  Ticket,
  Users,
} from "lucide-react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

const navItems = [
  { to: "/admin" as const, label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/events" as const, label: "Events", icon: CalendarDays },
  { to: "/admin/people" as const, label: "Speakers & Celebs", icon: Users },
  { to: "/admin/timetable" as const, label: "Timetable", icon: Clock },
  { to: "/admin/tickets" as const, label: "Tickets", icon: Ticket },
];

export function AdminSidebar() {
  const { clear } = useInternetIdentity();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await clear();
    qc.clear();
    navigate({ to: "/admin/login" });
  };

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <CalendarDays className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-bold text-lg text-sidebar-foreground">
          EventHub
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            activeProps={{
              className: "bg-primary text-white hover:text-white",
            }}
            data-ocid={`admin.${label.toLowerCase().replace(/ /g, "-")}.link`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          data-ocid="admin.logout.button"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
