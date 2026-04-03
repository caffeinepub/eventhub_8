import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, LogIn, Menu, Ticket, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

export function PublicHeader() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      qc.clear();
    } else {
      try {
        await login();
      } catch (err: any) {
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="bg-navy text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            data-ocid="nav.link"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <CalendarDays className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              EventHub
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              data-ocid="nav.link"
            >
              Events
            </Link>
            <Link
              to="/admin/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              data-ocid="admin.link"
            >
              Admin
            </Link>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="text-white/80 hover:text-white hover:bg-white/10"
              data-ocid="auth.button"
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              {isLoggingIn
                ? "Connecting..."
                : isAuthenticated
                  ? "Logout"
                  : "Login"}
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white font-medium px-4"
              onClick={() => navigate({ to: "/" })}
              data-ocid="nav.primary_button"
            >
              <Ticket className="w-4 h-4 mr-1.5" />
              Get Tickets
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-3 space-y-1 pb-4">
            <Link
              to="/"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => setMobileOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/admin/login"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => setMobileOpen(false)}
            >
              Admin
            </Link>
            <div className="pt-2 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAuth}
                disabled={isLoggingIn}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                {isLoggingIn
                  ? "Connecting..."
                  : isAuthenticated
                    ? "Logout"
                    : "Login"}
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Ticket className="w-4 h-4 mr-1.5" />
                Get Tickets
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
