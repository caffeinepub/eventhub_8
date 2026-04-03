import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { EventCard } from "../components/events/EventCard";
import { Footer } from "../components/layout/Footer";
import { PublicHeader } from "../components/layout/PublicHeader";
import {
  useGetAllEvents,
  useGetAttendeeCount,
  useGetPeopleByEvent,
  useGetTimetableByEvent,
} from "../hooks/useQueries";
import { useSeedData } from "../hooks/useSeedData";

function EventCardLoader({ eventId }: { eventId: bigint }) {
  const { data: events } = useGetAllEvents();
  const idx = Number(eventId);
  const event = events?.[idx];

  const { data: people, isLoading: pLoading } = useGetPeopleByEvent(eventId);
  const { data: timetable, isLoading: tLoading } =
    useGetTimetableByEvent(eventId);
  const { data: attendeeCount } = useGetAttendeeCount(eventId);

  if (!event) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.1 }}
    >
      <EventCard
        event={event}
        eventId={eventId}
        people={people ?? []}
        timetable={timetable ?? []}
        attendeeCount={attendeeCount ?? BigInt(0)}
        isPeopleLoading={pLoading}
        isTimetableLoading={tLoading}
        variant={idx === 0 ? "featured" : "standard"}
      />
    </motion.div>
  );
}

export function HomePage() {
  useSeedData();
  const [search, setSearch] = useState("");
  const { data: events, isLoading } = useGetAllEvents();

  const filteredIndices = useMemo(() => {
    if (!events) return [];
    const q = search.toLowerCase();
    return events
      .map((ev, idx) => ({ ev, idx }))
      .filter(
        ({ ev }) =>
          ev.name.toLowerCase().includes(q) ||
          ev.location.toLowerCase().includes(q) ||
          ev.description.toLowerCase().includes(q),
      )
      .map(({ idx }) => idx);
  }, [events, search]);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      {/* Hero strip */}
      <section className="bg-navy pb-8 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-2">
              Find Events
            </h1>
            <p className="text-white/60 text-lg mb-6">
              Discover world-class conferences, festivals, and summits near you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative max-w-lg"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-10 bg-white/95 border-0 shadow-md text-foreground placeholder:text-muted-foreground h-11 rounded-xl"
              placeholder="Search events by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="home.search_input"
            />
          </motion.div>
        </div>
      </section>

      {/* Events grid */}
      <main className="flex-1 bg-background py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="home.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-2xl shadow-card p-5">
                  <Skeleton className="h-48 w-full rounded-xl mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredIndices.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-24 text-center"
              data-ocid="home.empty_state"
            >
              <CalendarDays className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                {search ? "No events found" : "No events yet"}
              </h3>
              <p className="text-muted-foreground max-w-xs">
                {search
                  ? `No events match "${search}". Try a different search term.`
                  : "Events will appear here once they are created."}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  {filteredIndices.length} event
                  {filteredIndices.length !== 1 ? "s" : ""} found
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIndices.map((idx) => (
                  <EventCardLoader key={idx} eventId={BigInt(idx)} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
