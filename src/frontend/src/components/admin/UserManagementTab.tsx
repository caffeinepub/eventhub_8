import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../../backend";
import { useAssignUserRole } from "../../hooks/useQueries";

export function UserManagementTab() {
  const [principalId, setPrincipalId] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.user);
  const [principalError, setPrincipalError] = useState("");

  const assignRole = useAssignUserRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrincipalError("");

    if (!principalId.trim()) {
      setPrincipalError("Principal ID is required.");
      return;
    }

    assignRole.mutate(
      { principal: principalId.trim(), role },
      {
        onSuccess: () => {
          toast.success(`Role "${role}" assigned successfully.`);
          setPrincipalId("");
          setRole(UserRole.user);
        },
        onError: (err: unknown) => {
          const message =
            err instanceof Error ? err.message : "Failed to assign role.";
          if (
            message.toLowerCase().includes("invalid") ||
            message.toLowerCase().includes("principal")
          ) {
            setPrincipalError(
              "Invalid Principal ID format. Please check and try again.",
            );
          } else {
            toast.error(message);
          }
        },
      },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          User Management
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Assign roles to users by their Principal ID
        </p>
      </div>

      <div className="max-w-lg">
        <div className="bg-card rounded-2xl shadow-card p-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Assign Role</h3>
              <p className="text-xs text-muted-foreground">
                Grant or change access levels for any user
              </p>
            </div>
          </div>

          {/* Helper note */}
          <div className="rounded-lg bg-muted/60 border border-border px-4 py-3 mb-5 text-sm text-muted-foreground">
            Enter the Principal ID of the user you want to assign a role to. You
            can find a user&apos;s Principal ID when they connect with Internet
            Identity.
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="principal-id">Principal ID</Label>
              <Input
                id="principal-id"
                placeholder="e.g. aaaaa-aa or 2vxsx-fae..."
                value={principalId}
                onChange={(e) => {
                  setPrincipalId(e.target.value);
                  if (principalError) setPrincipalError("");
                }}
                aria-describedby={
                  principalError ? "principal-error" : undefined
                }
                data-ocid="users.input"
              />
              {principalError && (
                <p
                  id="principal-error"
                  className="text-xs text-destructive mt-1"
                  data-ocid="users.error_state"
                >
                  {principalError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role-select">Role</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as UserRole)}
              >
                <SelectTrigger id="role-select" data-ocid="users.select">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.admin}>Admin</SelectItem>
                  <SelectItem value={UserRole.user}>User</SelectItem>
                  <SelectItem value={UserRole.guest}>Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={assignRole.isPending}
              data-ocid="users.submit_button"
            >
              {assignRole.isPending ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Assigning...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Assign Role
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
