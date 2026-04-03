import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Loader2, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PersonRole } from "../../backend";
import {
  type Person,
  type PersonId,
  useCreatePerson,
  useDeletePerson,
  useGetAllEvents,
  useGetPeopleByEvent,
  useUpdatePerson,
} from "../../hooks/useQueries";

const emptyForm = (eventId: bigint): Person => ({
  name: "",
  role: PersonRole.speaker,
  bio: "",
  photoUrl: "",
  eventId,
});

function PeopleForEvent({
  eventId,
  eventName,
}: { eventId: bigint; eventName: string }) {
  const { data: people, isLoading } = useGetPeopleByEvent(eventId);
  const createPerson = useCreatePerson();
  const updatePerson = useUpdatePerson();
  const deletePerson = useDeletePerson();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<PersonId | null>(null);
  const [form, setForm] = useState<Person>(emptyForm(eventId));
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openAdd = () => {
    setForm(emptyForm(eventId));
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (idx: number) => {
    if (!people) return;
    setForm({ ...people[idx] });
    setEditingId(BigInt(idx));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId !== null) {
        await updatePerson.mutateAsync({ id: editingId, person: form });
        toast.success("Person updated");
      } else {
        await createPerson.mutateAsync(form);
        toast.success("Person added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleDelete = async (idx: number) => {
    try {
      await deletePerson.mutateAsync({ id: BigInt(idx), eventId });
      toast.success("Person removed");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const isSaving = createPerson.isPending || updatePerson.isPending;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base text-foreground">{eventName}</h3>
        <Button
          size="sm"
          onClick={openAdd}
          className="bg-primary hover:bg-primary/90 text-white text-xs"
          data-ocid="people.primary_button"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Person
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2" data-ocid="people.loading_state">
            {["s1", "s2"].map((k) => (
              <Skeleton key={k} className="h-10 w-full" />
            ))}
          </div>
        ) : !people || people.length === 0 ? (
          <div className="p-6 text-center" data-ocid="people.empty_state">
            <p className="text-sm text-muted-foreground">
              No speakers or celebrities yet
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Person</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">
                  Bio
                </TableHead>
                <TableHead className="font-semibold w-24 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {people.map((person, idx) => (
                <TableRow
                  key={`${person.name}-${person.role}`}
                  data-ocid={`people.item.${idx + 1}`}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={person.photoUrl} alt={person.name} />
                        <AvatarFallback className="text-xs bg-primary/20">
                          {person.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{person.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        person.role === PersonRole.speaker
                          ? "default"
                          : "secondary"
                      }
                      className={`capitalize text-xs ${
                        person.role === PersonRole.speaker
                          ? "bg-primary/15 text-primary border-0"
                          : "bg-yellow-100 text-yellow-700 border-0"
                      }`}
                    >
                      {person.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground line-clamp-1">
                      {person.bio}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(idx)}
                        data-ocid={`people.edit_button.${idx + 1}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteConfirm(idx)}
                        data-ocid={`people.delete_button.${idx + 1}`}
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
        <DialogContent className="sm:max-w-md" data-ocid="people.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingId !== null ? "Edit Person" : "Add Person"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Name</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Full name"
                data-ocid="people.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, role: v as PersonRole }))
                }
              >
                <SelectTrigger data-ocid="people.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PersonRole.speaker}>Speaker</SelectItem>
                  <SelectItem value={PersonRole.celebrity}>
                    Celebrity
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-bio">Bio</Label>
              <Textarea
                id="p-bio"
                value={form.bio}
                onChange={(e) =>
                  setForm((f) => ({ ...f, bio: e.target.value }))
                }
                placeholder="Short biography..."
                rows={3}
                data-ocid="people.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-photo">Photo URL</Label>
              <Input
                id="p-photo"
                value={form.photoUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, photoUrl: e.target.value }))
                }
                placeholder="https://..."
                data-ocid="people.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="people.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-white"
              data-ocid="people.save_button"
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
        <DialogContent className="sm:max-w-sm" data-ocid="people.modal">
          <DialogHeader>
            <DialogTitle>Remove Person?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              data-ocid="people.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirm !== null && handleDelete(deleteConfirm)
              }
              disabled={deletePerson.isPending}
              data-ocid="people.confirm_button"
            >
              {deletePerson.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function PeopleTab() {
  const { data: events, isLoading } = useGetAllEvents();

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Speakers & Celebrities
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage speakers and celebrity guests per event
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4" data-ocid="people.loading_state">
          {["s1", "s2"].map((k) => (
            <Skeleton key={k} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : !events || events.length === 0 ? (
        <div
          className="flex flex-col items-center py-16 text-center"
          data-ocid="people.empty_state"
        >
          <Users className="w-12 h-12 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">
            Create events first to add speakers
          </p>
        </div>
      ) : (
        events.map((ev, idx) => (
          <PeopleForEvent
            key={`${ev.name}-${ev.date}`}
            eventId={BigInt(idx)}
            eventName={ev.name}
          />
        ))
      )}
    </div>
  );
}
