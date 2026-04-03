import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, Ticket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRegisterTicket } from "../../hooks/useQueries";
import type { EventId } from "../../hooks/useQueries";

interface RegisterTicketModalProps {
  open: boolean;
  onClose: () => void;
  eventId: EventId;
  eventName: string;
}

export function RegisterTicketModal({
  open,
  onClose,
  eventId,
  eventName,
}: RegisterTicketModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [success, setSuccess] = useState(false);

  const { mutateAsync: registerTicket, isPending } = useRegisterTicket();

  const validate = () => {
    let valid = true;
    setNameError("");
    setEmailError("");
    if (!name.trim()) {
      setNameError("Name is required");
      valid = false;
    }
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await registerTicket({
        eventId,
        attendeeName: name.trim(),
        email: email.trim(),
      });
      setSuccess(true);
      toast.success("Ticket registered successfully!");
    } catch {
      toast.error("Failed to register ticket. Please try again.");
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setNameError("");
    setEmailError("");
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md" data-ocid="register.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {success ? "You're Registered!" : "Register for Event"}
          </DialogTitle>
          <DialogDescription>
            {success
              ? `Your ticket for ${eventName} has been confirmed.`
              : `Secure your spot at ${eventName}`}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div
            className="flex flex-col items-center py-8 gap-4"
            data-ocid="register.success_state"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">{name}</p>
              <p className="text-sm text-muted-foreground mt-1">{email}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 w-full flex items-center gap-3">
              <Ticket className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {eventName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ticket confirmed
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="attendee-name">Full Name</Label>
              <Input
                id="attendee-name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-ocid="register.input"
                autoComplete="name"
              />
              {nameError && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="register.error_state"
                >
                  {nameError}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="attendee-email">Email Address</Label>
              <Input
                id="attendee-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-ocid="register.input"
                autoComplete="email"
              />
              {emailError && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="register.error_state"
                >
                  {emailError}
                </p>
              )}
            </div>
            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                data-ocid="register.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary hover:bg-primary/90 text-white"
                data-ocid="register.submit_button"
              >
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isPending ? "Registering..." : "Register Now"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {success && (
          <DialogFooter>
            <Button
              onClick={handleClose}
              className="w-full bg-primary hover:bg-primary/90 text-white"
              data-ocid="register.close_button"
            >
              Done
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
