import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Event,
  EventId,
  Person,
  PersonId,
  PersonRole,
  Ticket,
  TimetableEntry,
  TimetableId,
} from "../backend";
import { useActor } from "./useActor";

export type { Event, Person, TimetableEntry, Ticket, PersonRole };
export type { EventId, PersonId, TimetableId };

// ─── Events ────────────────────────────────────────────────────────────────

export function useGetAllEvents() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEvents();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetEvent(id: EventId) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Event>({
    queryKey: ["event", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getEvent(id);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (event: Event) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createEvent(event);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useUpdateEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, event }: { id: EventId; event: Event }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateEvent(id, event);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useDeleteEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: EventId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteEvent(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

// ─── People ────────────────────────────────────────────────────────────────

export function useGetPeopleByEvent(eventId: EventId) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Person[]>({
    queryKey: ["people", eventId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPeopleByEvent(eventId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreatePerson() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (person: Person) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createPerson(person);
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ["people", vars.eventId.toString()] }),
  });
}

export function useUpdatePerson() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, person }: { id: PersonId; person: Person }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updatePerson(id, person);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["people"] }),
  });
}

export function useDeletePerson() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, eventId }: { id: PersonId; eventId: EventId }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deletePerson(id);
      return eventId;
    },
    onSuccess: (eventId) =>
      qc.invalidateQueries({ queryKey: ["people", eventId.toString()] }),
  });
}

// ─── Timetable ─────────────────────────────────────────────────────────────

export function useGetTimetableByEvent(eventId: EventId) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<TimetableEntry[]>({
    queryKey: ["timetable", eventId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTimetableByEvent(eventId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateTimetableEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: TimetableEntry) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createTimetableEntry(entry);
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: ["timetable", vars.eventId.toString()],
      }),
  });
}

export function useUpdateTimetableEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      entry,
    }: {
      id: TimetableId;
      entry: TimetableEntry;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateTimetableEntry(id, entry);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["timetable"] }),
  });
}

export function useDeleteTimetableEntry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      eventId,
    }: {
      id: TimetableId;
      eventId: EventId;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteTimetableEntry(id);
      return eventId;
    },
    onSuccess: (eventId) =>
      qc.invalidateQueries({ queryKey: ["timetable", eventId.toString()] }),
  });
}

// ─── Tickets ───────────────────────────────────────────────────────────────

export function useGetTicketsByEvent(eventId: EventId) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Ticket[]>({
    queryKey: ["tickets", eventId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTicketsByEvent(eventId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAttendeeCount(eventId: EventId) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["attendee-count", eventId.toString()],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getAttendeeCount(eventId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useRegisterTicket() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ticket: Ticket) => {
      if (!actor) throw new Error("Actor not available");
      return actor.registerTicket(ticket);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["tickets", vars.eventId.toString()],
      });
      qc.invalidateQueries({
        queryKey: ["attendee-count", vars.eventId.toString()],
      });
    },
  });
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}
