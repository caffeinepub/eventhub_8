import { Skeleton } from "@/components/ui/skeleton";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  LayoutDashboard,
  Loader2,
  Ticket,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { EventsTab } from "../components/admin/EventsTab";
import { PeopleTab } from "../components/admin/PeopleTab";
import { TicketsTab } from "../components/admin/TicketsTab";
import { TimetableTab } from "../components/admin/TimetableTab";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllEvents, useIsCallerAdmin } from "../hooks/useQueries";

function KpiCard({
  label,
  value,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  loading?: boolean;
}) {
  return (
    <div className="bg-card rounded-2xl shadow-card p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        {loading ? (
          <Skeleton className="h-7 w-16 mt-1" />
        ) : (
          <p className="font-display font-bold text-2xl text-foreground">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function DashboardHome() {
  const { data: events, isLoading: evLoading } = useGetAllEvents();
  const totalEvents = events?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Dashboard
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Welcome back, Admin
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <KpiCard
          label="Total Events"
          value={evLoading ? "…" : totalEvents}
          icon={CalendarDays}
          loading={evLoading}
        />
        <KpiCard
          label="Total Speakers"
          value={evLoading ? "…" : `${Math.max(0, totalEvents * 2)}`}
          icon={Users}
          loading={evLoading}
        />
        <KpiCard
          label="Total Registered"
          value={evLoading ? "…" : "—"}
          icon={Ticket}
        />
      </div>

      <div className="bg-card rounded-2xl shadow-card p-5">
        <h3 className="font-semibold mb-4 text-foreground">Recent Events</h3>
        {evLoading ? (
          <div className="space-y-3">
            {["s1", "s2"].map((k) => (
              <Skeleton key={k} className="h-12 w-full" />
            ))}
          </div>
        ) : !events || events.length === 0 ? (
          <div className="text-center py-8" data-ocid="admin.empty_state">
            <LayoutDashboard className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No events created yet
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.slice(0, 5).map((ev, idx) => (
              <div
                key={`${ev.name}-${ev.date}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                data-ocid={`admin.item.${idx + 1}`}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{ev.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {ev.date} · {ev.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AdminContent() {
  const location = useLocation();
  const path = location.pathname;

  if (path === "/admin/events") return <EventsTab />;
  if (path === "/admin/people") return <PeopleTab />;
  if (path === "/admin/timetable") return <TimetableTab />;
  if (path === "/admin/tickets") return <TicketsTab />;
  return <DashboardHome />;
}

export function AdminDashboard() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/admin/login" });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!adminLoading && isAdmin === false) {
      navigate({ to: "/admin/login" });
    }
  }, [isAdmin, adminLoading, navigate]);

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />

      {/* Content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-sm font-medium text-foreground">Admin</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto bg-background">
          <AdminContent />
        </main>
      </div>
    </div>
  );
}
