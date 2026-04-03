# EventHub

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Public-facing event listing page showing event name, description, date/time, speakers, celebrities
- Public timetable/schedule view for each event (sessions with time, speaker, topic)
- Ticket attendance counter per event (how many people are attending)
- Admin dashboard (login: Username: Jatin, Password: Jatin@3010)
  - Manage Events: add, edit, delete events
  - Manage Timetable: add, edit, delete schedule sessions per event
  - Manage Speakers: add, edit, delete speakers
  - Manage Celebrities: add, edit, delete celebrities
  - Ticket Data: view attendance count per event (people attending via tickets)
- Ticket system: users can register/claim a ticket for an event (tracked per event)

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend (Motoko):
   - Event type: id, name, description, date, location, imageUrl
   - Speaker type: id, name, bio, eventId, role (speaker/celebrity)
   - TimetableEntry type: id, eventId, time, topic, speakerId
   - Ticket type: id, eventId, attendeeName, attendeeEmail
   - CRUD for events, speakers, timetable entries
   - Ticket registration (public) and ticket count query
   - Admin auth: hardcoded username/password check returning a session token
2. Frontend:
   - Public pages: Home (event list), Event Detail (speakers, celebs, timetable), Register Ticket modal
   - Admin pages: Login, Dashboard with tabs for Events, Speakers/Celebs, Timetable, Ticket Stats
   - React Router for navigation
   - Tailwind + shadcn UI components
