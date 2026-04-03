import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type EventId = bigint;
export type TimetableId = bigint;
export interface Event {
    date: string;
    name: string;
    description: string;
    image?: string;
    location: string;
}
export interface TimetableEntry {
    eventId: EventId;
    topic: string;
    time: string;
    speakerName?: string;
}
export interface Ticket {
    eventId: EventId;
    attendeeName: string;
    email: string;
}
export type PersonId = bigint;
export type TicketId = bigint;
export interface UserProfile {
    name: string;
}
export interface Person {
    bio: string;
    eventId: EventId;
    name: string;
    role: PersonRole;
    photoUrl: string;
}
export enum PersonRole {
    celebrity = "celebrity",
    speaker = "speaker"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createEvent(event: Event): Promise<EventId>;
    createPerson(person: Person): Promise<PersonId>;
    createTimetableEntry(entry: TimetableEntry): Promise<TimetableId>;
    deleteEvent(id: EventId): Promise<void>;
    deletePerson(id: PersonId): Promise<void>;
    deleteTimetableEntry(id: TimetableId): Promise<void>;
    getAllEvents(): Promise<Array<Event>>;
    getAttendeeCount(eventId: EventId): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEvent(id: EventId): Promise<Event>;
    getPeopleByEvent(eventId: EventId): Promise<Array<Person>>;
    getTicketsByEvent(eventId: EventId): Promise<Array<Ticket>>;
    getTimetableByEvent(eventId: EventId): Promise<Array<TimetableEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerTicket(ticket: Ticket): Promise<TicketId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateEvent(id: EventId, event: Event): Promise<void>;
    updatePerson(id: PersonId, person: Person): Promise<void>;
    updateTimetableEntry(id: TimetableId, entry: TimetableEntry): Promise<void>;
}
