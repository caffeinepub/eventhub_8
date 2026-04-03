import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Mic,
  Star,
  Ticket,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { PersonRole } from "../backend";
import { RegisterTicketModal } from "../components/events/RegisterTicketModal";
import { Footer } from "../components/layout/Footer";
import { PublicHeader } from "../components/layout/PublicHeader";
import {
  useGetAllEvents,
  useGetAttendeeCount,
  useGetPeopleByEvent,
  useGetTimetableByEvent,
} from "../hooks/useQueries";

export function EventDetailPage() {
  const { id } = useParams({ from: "/events/$id" });
  const navigate = useNavigate();
  const eventId = BigInt(id ?? "0");
  const eventIdx = Number(eventId);

  const { data: events, isLoading: evLoading } = useGetAllEvents();
  const event = events?.[eventIdx];

  const { data: people, isLoading: pLoading } = useGetPeopleByEvent(eventId);
  const { data: timetable, isLoading: tLoading } =
    useGetTimetableByEvent(eventId);
  const { data: attendeeCount } = useGetAttendeeCount(eventId);

  const [registerOpen, setRegisterOpen] = useState(false);

  const speakers = people?.filter((p) => p.role === PersonRole.speaker) ?? [];
  const celebrities =
    people?.filter((p) => p.role === PersonRole.celebrity) ?? [];

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (evLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1 bg-background">
          <div className="max-w-4xl mx-auto px-4 py-10">
            <Skeleton className="h-64 w-full rounded-2xl mb-6" />
            <Skeleton className="h-8 w-1/2 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1 bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold mb-2">
              Event not found
            </h2>
            <Button onClick={() => navigate({ to: "/" })} variant="outline">
              Back to Events
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1 bg-background">
        {/* Hero image */}
        {event.image && (
          <div className="relative h-72 sm:h-96 overflow-hidden">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-4 sm:left-10">
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-display font-bold text-3xl sm:text-5xl text-white"
              >
                {event.name}
              </motion.h1>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/" })}
            className="mb-6 -ml-2 text-muted-foreground"
            data-ocid="event-detail.secondary_button"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Events
          </Button>

          {!event.image && (
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4">
              {event.name}
            </h1>
          )}

          {/* Meta strip */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-primary" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              {event.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              {Number(attendeeCount ?? BigInt(0)).toLocaleString()} attending
            </span>
          </div>

          {/* Description */}
          <div className="bg-card rounded-2xl shadow-card p-6 mb-6">
            <h2 className="font-display font-semibold text-lg mb-3">
              About This Event
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Speakers */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mic className="w-4 h-4 text-primary" />
                <h2 className="font-display font-semibold text-lg">Speakers</h2>
              </div>
              {pLoading ? (
                <div className="space-y-3">
                  {["s1", "s2"].map((k) => (
                    <Skeleton key={k} className="h-14 w-full rounded-lg" />
                  ))}
                </div>
              ) : speakers.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No speakers announced yet
                </p>
              ) : (
                <div className="space-y-3">
                  {speakers.map((s, i) => (
                    <motion.div
                      key={`${s.name}-${s.role}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <Avatar className="w-11 h-11 border-2 border-border">
                        <AvatarImage src={s.photoUrl} alt={s.name} />
                        <AvatarFallback className="bg-primary text-white text-sm">
                          {s.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{s.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {s.bio}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Celebrities */}
            <div className="bg-card rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-yellow-500" />
                <h2 className="font-display font-semibold text-lg">
                  Celebrity Guests
                </h2>
              </div>
              {pLoading ? (
                <div className="space-y-3">
                  {["s1"].map((k) => (
                    <Skeleton key={k} className="h-14 w-full rounded-lg" />
                  ))}
                </div>
              ) : celebrities.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No celebrity guests announced yet
                </p>
              ) : (
                <div className="space-y-3">
                  {celebrities.map((c, i) => (
                    <motion.div
                      key={`${c.name}-${c.role}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <Avatar className="w-11 h-11 border-2 border-yellow-200">
                        <AvatarImage src={c.photoUrl} alt={c.name} />
                        <AvatarFallback className="bg-yellow-100 text-yellow-700 text-sm">
                          {c.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {c.bio}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Full Timetable */}
          <div className="bg-card rounded-2xl shadow-card p-6 mb-8">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-4 h-4 text-primary" />
              <h2 className="font-display font-semibold text-lg">
                Full Schedule
              </h2>
            </div>
            {tLoading ? (
              <div className="space-y-3">
                {["s1", "s2", "s3"].map((k) => (
                  <Skeleton key={k} className="h-12 w-full" />
                ))}
              </div>
            ) : !timetable || timetable.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                Schedule coming soon
              </p>
            ) : (
              <div className="space-y-0 divide-y divide-border">
                {timetable.map((entry, i) => (
                  <motion.div
                    key={`${entry.time}-${entry.topic}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-5 py-4"
                    data-ocid={`event-detail.item.${i + 1}`}
                  >
                    <div className="w-24 flex-shrink-0">
                      <span className="font-mono text-sm font-semibold text-primary">
                        {entry.time}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">
                        {entry.topic}
                      </p>
                      {entry.speakerName && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {entry.speakerName}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Register CTA */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">
                Ready to attend?
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Secure your spot at {event.name}
              </p>
            </div>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 flex-shrink-0"
              onClick={() => setRegisterOpen(true)}
              data-ocid="event-detail.primary_button"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Register Now
            </Button>
          </div>
        </div>
      </main>

      <Footer />

      <RegisterTicketModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        eventId={eventId}
        eventName={event.name}
      />
    </div>
  );
}
