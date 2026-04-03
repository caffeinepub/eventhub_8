import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, Loader2, LogIn, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

export function AdminLoginPage() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate({ to: "/admin" });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleLogin = async () => {
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

  const isChecking = adminLoading || isInitializing;

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-2xl shadow-modal p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-foreground">
            EventHub
          </span>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h1 className="font-display font-bold text-2xl text-foreground">
              Admin Portal
            </h1>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Connect with your Internet Identity wallet to access the admin
            dashboard. Only authorized administrators can log in.
          </p>
        </div>

        {/* Auth state */}
        {isAuthenticated && (
          <div className="bg-muted rounded-xl p-4 mb-5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm text-foreground">Connected</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {identity?.getPrincipal().toString()}
              </p>
              {isChecking ? (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Checking admin access...
                </p>
              ) : isAdmin === false ? (
                <p className="text-xs text-destructive mt-1">
                  This account does not have admin access.
                </p>
              ) : null}
            </div>
          </div>
        )}

        <Button
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold"
          onClick={handleLogin}
          disabled={isLoggingIn || isChecking}
          data-ocid="admin-login.primary_button"
        >
          {isLoggingIn || isChecking ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isLoggingIn ? "Connecting..." : "Verifying..."}
            </>
          ) : isAuthenticated ? (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Switch Account
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Connect with Internet Identity
            </>
          )}
        </Button>

        {isAuthenticated && (
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => navigate({ to: "/" })}
            data-ocid="admin-login.secondary_button"
          >
            Back to Events
          </Button>
        )}

        <p className="text-xs text-muted-foreground text-center mt-6">
          This is a secure admin area. Only authorized principals can access the
          dashboard.
        </p>
      </motion.div>
    </div>
  );
}
