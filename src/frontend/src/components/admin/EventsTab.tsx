import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type Event,
  type EventId,
  useCreateEvent,
  useDeleteEvent,
  useGetAllEvents,
  useUpdateEvent,
} from "../../hooks/useQueries";

const emptyForm = (): Event => ({
  name: "",
  date: "",
  location: "",
  description: "",
  image: "",
});

export function EventsTab() {
  const { data: events, isLoading } = useGetAllEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<EventId | null>(null);
  const [form, setForm] = useState<Event>(emptyForm());
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openAdd = () => {
    setForm(emptyForm());
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (idx: number) => {
    if (!events) return;
    const ev = events[idx];
    setForm({ ...ev });
    setEditingId(BigInt(idx));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId !== null) {
        await updateEvent.mutateAsync({ id: editingId, event: form });
        toast.success("Event updated successfully");
      } else {
        await createEvent.mutateAsync(form);
        toast.success("Event created successfully");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save event");
    }
  };

  const handleDelete = async (idx: number) => {
    try {
      await deleteEvent.mutateAsync(BigInt(idx));
      toast.success("Event deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete event");
    }
  };

  const isSaving = createEvent.isPending || updateEvent.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Events
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage all events
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-primary hover:bg-primary/90 text-white"
          data-ocid="events.primary_button"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Event
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3" data-ocid="events.loading_state">
            {["sk1", "sk2", "sk3"].map((k) => (
              <Skeleton key={k} className="h-12 w-full" />
            ))}
          </div>
        ) : !events || events.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-center"
            data-ocid="events.empty_state"
          >
            <CalendarDays className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-medium">No events yet</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Create your first event to get started
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">
                  Location
                </TableHead>
                <TableHead className="font-semibold w-28 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((ev, idx) => (
                <TableRow
                  key={`event-${ev.name}-${ev.date}`}
                  className="hover:bg-muted/30"
                  data-ocid={`events.item.${idx + 1}`}
                >
                  <TableCell className="font-medium">{ev.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {ev.date}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                    <span className="truncate max-w-[200px] block">
                      {ev.location}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => openEdit(idx)}
                        data-ocid={`events.edit_button.${idx + 1}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteConfirm(idx)}
                        data-ocid={`events.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg" data-ocid="events.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingId !== null ? "Edit Event" : "Add New Event"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="ev-name">Event Name</Label>
              <Input
                id="ev-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="TechSummit 2026"
                data-ocid="events.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ev-date">Date</Label>
                <Input
                  id="ev-date"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  data-ocid="events.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ev-location">Location</Label>
                <Input
                  id="ev-location"
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  placeholder="City, Venue"
                  data-ocid="events.input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-desc">Description</Label>
              <Textarea
                id="ev-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Event description..."
                rows={3}
                data-ocid="events.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-image">Image URL (optional)</Label>
              <Input
                id="ev-image"
                value={form.image ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image: e.target.value }))
                }
                placeholder="https://..."
                data-ocid="events.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="events.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-white"
              data-ocid="events.save_button"
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSaving ? "Saving..." : "Save Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={deleteConfirm !== null}
        onOpenChange={(o) => !o && setDeleteConfirm(null)}
      >
        <DialogContent className="sm:max-w-sm" data-ocid="events.modal">
          <DialogHeader>
            <DialogTitle>Delete Event?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete the event and cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              data-ocid="events.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirm !== null && handleDelete(deleteConfirm)
              }
              disabled={deleteEvent.isPending}
              data-ocid="events.confirm_button"
            >
              {deleteEvent.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
