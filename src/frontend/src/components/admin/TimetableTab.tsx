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
import { Clock, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type TimetableEntry,
  type TimetableId,
  useCreateTimetableEntry,
  useDeleteTimetableEntry,
  useGetAllEvents,
  useGetTimetableByEvent,
  useUpdateTimetableEntry,
} from "../../hooks/useQueries";

const emptyEntry = (eventId: bigint): TimetableEntry => ({
  eventId,
  time: "",
  topic: "",
  speakerName: "",
});

function TimetableForEvent({
  eventId,
  eventName,
}: { eventId: bigint; eventName: string }) {
  const { data: entries, isLoading } = useGetTimetableByEvent(eventId);
  const createEntry = useCreateTimetableEntry();
  const updateEntry = useUpdateTimetableEntry();
  const deleteEntry = useDeleteTimetableEntry();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<TimetableId | null>(null);
  const [form, setForm] = useState<TimetableEntry>(emptyEntry(eventId));
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openAdd = () => {
    setForm(emptyEntry(eventId));
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (idx: number) => {
    if (!entries) return;
    setForm({ ...entries[idx] });
    setEditingId(BigInt(idx));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId !== null) {
        await updateEntry.mutateAsync({ id: editingId, entry: form });
        toast.success("Entry updated");
      } else {
        await createEntry.mutateAsync(form);
        toast.success("Entry added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save entry");
    }
  };

  const handleDelete = async (idx: number) => {
    try {
      await deleteEntry.mutateAsync({ id: BigInt(idx), eventId });
      toast.success("Entry deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const isSaving = createEntry.isPending || updateEntry.isPending;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base text-foreground">{eventName}</h3>
        <Button
          size="sm"
          onClick={openAdd}
          className="bg-primary hover:bg-primary/90 text-white text-xs"
          data-ocid="timetable.primary_button"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Entry
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2" data-ocid="timetable.loading_state">
            {["s1", "s2"].map((k) => (
              <Skeleton key={k} className="h-10 w-full" />
            ))}
          </div>
        ) : !entries || entries.length === 0 ? (
          <div className="p-6 text-center" data-ocid="timetable.empty_state">
            <p className="text-sm text-muted-foreground">
              No schedule entries yet
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Time</TableHead>
                <TableHead className="font-semibold">Topic</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">
                  Speaker
                </TableHead>
                <TableHead className="font-semibold w-24 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, idx) => (
                <TableRow
                  key={`${entry.time}-${entry.topic}`}
                  data-ocid={`timetable.item.${idx + 1}`}
                >
                  <TableCell>
                    <span className="font-mono text-sm font-medium text-primary">
                      {entry.time}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {entry.topic}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {entry.speakerName ?? (
                      <span className="text-muted-foreground/50 italic">
                        TBD
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(idx)}
                        data-ocid={`timetable.edit_button.${idx + 1}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteConfirm(idx)}
                        data-ocid={`timetable.delete_button.${idx + 1}`}
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

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md" data-ocid="timetable.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingId !== null ? "Edit Entry" : "Add Timetable Entry"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="t-time">Time</Label>
              <Input
                id="t-time"
                value={form.time}
                onChange={(e) =>
                  setForm((f) => ({ ...f, time: e.target.value }))
                }
                placeholder="09:00 AM"
                data-ocid="timetable.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-topic">Topic</Label>
              <Input
                id="t-topic"
                value={form.topic}
                onChange={(e) =>
                  setForm((f) => ({ ...f, topic: e.target.value }))
                }
                placeholder="Session title or topic"
                data-ocid="timetable.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-speaker">Speaker Name (optional)</Label>
              <Input
                id="t-speaker"
                value={form.speakerName ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, speakerName: e.target.value }))
                }
                placeholder="Speaker name"
                data-ocid="timetable.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="timetable.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-white"
              data-ocid="timetable.save_button"
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={deleteConfirm !== null}
        onOpenChange={(o) => !o && setDeleteConfirm(null)}
      >
        <DialogContent className="sm:max-w-sm" data-ocid="timetable.modal">
          <DialogHeader>
            <DialogTitle>Delete Entry?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              data-ocid="timetable.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirm !== null && handleDelete(deleteConfirm)
              }
              disabled={deleteEntry.isPending}
              data-ocid="timetable.confirm_button"
            >
              {deleteEntry.isPending && (
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

export function TimetableTab() {
  const { data: events, isLoading } = useGetAllEvents();

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Timetable
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage session schedules per event
        </p>
      </div>
      {isLoading ? (
        <div className="space-y-4" data-ocid="timetable.loading_state">
          {["s1", "s2"].map((k) => (
            <Skeleton key={k} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : !events || events.length === 0 ? (
        <div
          className="flex flex-col items-center py-16 text-center"
          data-ocid="timetable.empty_state"
        >
          <Clock className="w-12 h-12 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">
            Create events first to add timetable entries
          </p>
        </div>
      ) : (
        events.map((ev, idx) => (
          <TimetableForEvent
            key={`${ev.name}-${ev.date}`}
            eventId={BigInt(idx)}
            eventName={ev.name}
          />
        ))
      )}
    </div>
  );
}
