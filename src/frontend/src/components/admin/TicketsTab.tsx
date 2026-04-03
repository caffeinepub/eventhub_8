import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ticket, Users } from "lucide-react";
import {
  useGetAllEvents,
  useGetAttendeeCount,
  useGetTicketsByEvent,
} from "../../hooks/useQueries";

function TicketsForEvent({
  eventId,
  eventName,
}: { eventId: bigint; eventName: string }) {
  const { data: tickets, isLoading } = useGetTicketsByEvent(eventId);
  const { data: count } = useGetAttendeeCount(eventId);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-base text-foreground">
            {eventName}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {count !== undefined ? Number(count) : "—"} attendee
            {count !== BigInt(1) ? "s" : ""}
          </p>
        </div>
        <Badge className="bg-primary/15 text-primary border-0">
          <Users className="w-3 h-3 mr-1" />
          {count !== undefined ? Number(count) : "…"} registered
        </Badge>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2" data-ocid="tickets.loading_state">
            {["s1", "s2"].map((k) => (
              <Skeleton key={k} className="h-10 w-full" />
            ))}
          </div>
        ) : !tickets || tickets.length === 0 ? (
          <div className="p-6 text-center" data-ocid="tickets.empty_state">
            <p className="text-sm text-muted-foreground">
              No ticket registrations yet
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">#</TableHead>
                <TableHead className="font-semibold">Attendee Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket, idx) => (
                <TableRow
                  key={`${ticket.attendeeName}-${ticket.email}`}
                  data-ocid={`tickets.item.${idx + 1}`}
                >
                  <TableCell className="text-muted-foreground text-sm w-12">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {ticket.attendeeName}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {ticket.email}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export function TicketsTab() {
  const { data: events, isLoading } = useGetAllEvents();

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Tickets
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          View all ticket registrations and attendance data
        </p>
      </div>
      {isLoading ? (
        <div className="space-y-4" data-ocid="tickets.loading_state">
          {["s1", "s2"].map((k) => (
            <Skeleton key={k} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : !events || events.length === 0 ? (
        <div
          className="flex flex-col items-center py-16 text-center"
          data-ocid="tickets.empty_state"
        >
          <Ticket className="w-12 h-12 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No ticket data yet</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            Create events and share them to see registrations
          </p>
        </div>
      ) : (
        events.map((ev, idx) => (
          <TicketsForEvent
            key={`${ev.name}-${ev.date}`}
            eventId={BigInt(idx)}
            eventName={ev.name}
          />
        ))
      )}
    </div>
  );
}
