import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Access Control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type PersonRole = { #speaker; #celebrity };
  type EventId = Nat;
  type PersonId = Nat;
  type TimetableId = Nat;
  type TicketId = Nat;

  type Event = {
    name : Text;
    description : Text;
    date : Text;
    location : Text;
    image : ?Text;
  };

  type Person = {
    name : Text;
    bio : Text;
    photoUrl : Text;
    role : PersonRole;
    eventId : EventId;
  };

  type TimetableEntry = {
    eventId : EventId;
    time : Text;
    topic : Text;
    speakerName : ?Text;
  };

  type Ticket = {
    attendeeName : Text;
    email : Text;
    eventId : EventId;
  };

  public type UserProfile = {
    name : Text;
  };

  // Compare modules
  module Person {
    public func compare(a : Person, b : Person) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  // Storage
  let events = Map.empty<EventId, Event>();
  let people = Map.empty<PersonId, Person>();
  let timetableEntries = Map.empty<TimetableId, TimetableEntry>();
  let tickets = Map.empty<TicketId, Ticket>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // ID counters
  var nextEventId = 1;
  var nextPersonId = 1;
  var nextTimetableId = 1;
  var nextTicketId = 1;

  // Helper functions
  func getEventInternal(id : EventId) : Event {
    switch (events.get(id)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) { event };
    };
  };

  func getPersonInternal(id : PersonId) : Person {
    switch (people.get(id)) {
      case (null) { Runtime.trap("Person not found") };
      case (?person) { person };
    };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Event CRUD (Admin only)
  public shared ({ caller }) func createEvent(event : Event) : async EventId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create events");
    };

    let eventId = nextEventId;
    events.add(eventId, event);
    nextEventId += 1;
    eventId;
  };

  public shared ({ caller }) func updateEvent(id : EventId, event : Event) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update events");
    };

    if (not events.containsKey(id)) {
      Runtime.trap("Event not found");
    };
    events.add(id, event);
  };

  public shared ({ caller }) func deleteEvent(id : EventId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete events");
    };

    if (not events.containsKey(id)) {
      Runtime.trap("Event not found");
    };
    events.remove(id);
  };

  // Person CRUD (Admin only)
  public shared ({ caller }) func createPerson(person : Person) : async PersonId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create people");
    };

    let eventId = person.eventId;
    ignore getEventInternal(eventId);

    let personId = nextPersonId;
    let updatedPerson = { person with eventId };
    people.add(personId, updatedPerson);
    nextPersonId += 1;
    personId;
  };

  public shared ({ caller }) func updatePerson(id : PersonId, person : Person) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update people");
    };

    ignore getPersonInternal(id);
    ignore getEventInternal(person.eventId);

    people.add(id, person);
  };

  public shared ({ caller }) func deletePerson(id : PersonId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete people");
    };

    ignore getPersonInternal(id);
    people.remove(id);
  };

  // Timetable CRUD (Admin only)
  public shared ({ caller }) func createTimetableEntry(entry : TimetableEntry) : async TimetableId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create timetable entries");
    };

    ignore getEventInternal(entry.eventId);

    let timetableId = nextTimetableId;
    timetableEntries.add(timetableId, entry);
    nextTimetableId += 1;
    timetableId;
  };

  public shared ({ caller }) func updateTimetableEntry(id : TimetableId, entry : TimetableEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update timetable entries");
    };

    if (not timetableEntries.containsKey(id)) {
      Runtime.trap("Timetable entry not found");
    };
    ignore getEventInternal(entry.eventId);

    timetableEntries.add(id, entry);
  };

  public shared ({ caller }) func deleteTimetableEntry(id : TimetableId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete timetable entries");
    };

    if (not timetableEntries.containsKey(id)) {
      Runtime.trap("Timetable entry not found");
    };
    timetableEntries.remove(id);
  };

  // Ticket registration (Public - must be shared, not query, because it modifies state)
  public shared ({ caller }) func registerTicket(ticket : Ticket) : async TicketId {
    ignore getEventInternal(ticket.eventId);

    let ticketId = nextTicketId;
    tickets.add(ticketId, ticket);
    nextTicketId += 1;
    ticketId;
  };

  // Queries (Public - no authorization needed)
  public query ({ caller }) func getEvent(id : EventId) : async Event {
    getEventInternal(id);
  };

  public query ({ caller }) func getAllEvents() : async [Event] {
    events.values().toArray();
  };

  public query ({ caller }) func getPeopleByEvent(eventId : EventId) : async [Person] {
    people.values().toArray().filter(func(p) { p.eventId == eventId }).sort();
  };

  public query ({ caller }) func getTimetableByEvent(eventId : EventId) : async [TimetableEntry] {
    timetableEntries.values().toArray().filter(func(e) { e.eventId == eventId });
  };

  // Admin-only ticket views
  public query ({ caller }) func getTicketsByEvent(eventId : EventId) : async [Ticket] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view tickets");
    };

    tickets.values().toArray().filter(func(t) { t.eventId == eventId });
  };

  public query ({ caller }) func getAttendeeCount(eventId : EventId) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view attendee count");
    };

    tickets.values().toArray().filter(func(t) { t.eventId == eventId }).size();
  };
};
