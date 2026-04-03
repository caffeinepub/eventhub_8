import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  Mic,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { PersonRole } from "../../backend";
import type { Event, Person, TimetableEntry } from "../../hooks/useQueries";
import { RegisterTicketModal } from "./RegisterTicketModal";

interface EventCardProps {
  event: Event;
  eventId: bigint;
  people: Person[];
  timetable: TimetableEntry[];
  attendeeCount: bigint;
  isPeopleLoading?: boolean;
  isTimetableLoading?: boolean;
  variant?: "featured" | "standard";
}

export function EventCard({
  event,
  eventId,
  people,
  timetable,
  attendeeCount,
  isPeopleLoading,
  isTimetableLoading,
  variant = "standard",
}: EventCardProps) {
  const navigate = useNavigate();
  const [registerOpen, setRegisterOpen] = useState(false);

  const speakers = people.filter((p) => p.role === PersonRole.speaker);
  const celebrities = people.filter((p) => p.role === PersonRole.celebrity);
  const previewTimetable = timetable.slice(0, 3);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <article
        className={`bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow duration-300 ${
          variant === "featured" ? "border-l-4 border-l-primary" : ""
        }`}
      >
        {/* Event image */}
        {event.image && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-4 flex gap-2">
              {variant === "featured" && (
                <Badge className="bg-primary text-white border-0 text-xs font-semibold">
                  Featured
                </Badge>
              )}
              <Badge className="bg-black/40 text-white border-0 backdrop-blur-sm text-xs">
                {speakers.length + celebrities.length} Guests
              </Badge>
            </div>
          </div>
        )}

        <div className="p-5">
          {/* Header */}
          <div className="mb-4">
            <h3 className="font-display font-bold text-xl text-foreground mb-2 leading-tight">
              {event.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-3 mb-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-primary" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="truncate max-w-[180px]">{event.location}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              {Number(attendeeCount).toLocaleString()} attending
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Speakers */}
            <div>
              {speakers.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Mic className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Speakers
                    </span>
                  </div>
                  {isPeopleLoading ? (
                    <div className="flex gap-2">
                      {["a", "b"].map((k) => (
                        <Skeleton key={k} className="w-9 h-9 rounded-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {speakers.slice(0, 3).map((speaker) => (
                        <div
                          key={speaker.name}
                          className="flex items-center gap-1.5"
                        >
                          <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                            <AvatarImage
                              src={speaker.photoUrl}
                              alt={speaker.name}
                            />
                            <AvatarFallback className="text-xs bg-primary text-white">
                              {speaker.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-foreground truncate max-w-[100px]">
                            {speaker.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Celebrities */}
              {celebrities.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Celebrities
                    </span>
                  </div>
                  {isPeopleLoading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {celebrities.slice(0, 2).map((celeb) => (
                        <Badge
                          key={celeb.name}
                          variant="secondary"
                          className="text-xs font-medium"
                        >
                          {celeb.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Timetable preview */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Schedule
                </span>
              </div>
              {isTimetableLoading ? (
                <div className="space-y-1.5">
                  {["a", "b"].map((k) => (
                    <Skeleton key={k} className="h-4 w-full" />
                  ))}
                </div>
              ) : previewTimetable.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  Schedule coming soon
                </p>
              ) : (
                <div className="space-y-1.5">
                  {previewTimetable.map((entry) => (
                    <div
                      key={`${entry.time}-${entry.topic}`}
                      className="flex gap-2 text-xs"
                    >
                      <span className="text-primary font-mono font-medium whitespace-nowrap">
                        {entry.time}
                      </span>
                      <span className="text-muted-foreground line-clamp-1">
                        {entry.topic}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex gap-2 mt-5 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-sm"
              onClick={() =>
                navigate({
                  to: "/events/$id",
                  params: { id: eventId.toString() },
                })
              }
              data-ocid="event.secondary_button"
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
            <Button
              size="sm"
              className="flex-1 text-sm bg-primary hover:bg-primary/90 text-white"
              onClick={() => setRegisterOpen(true)}
              data-ocid="event.primary_button"
            >
              Register Now
            </Button>
          </div>
        </div>
      </article>

      <RegisterTicketModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        eventId={eventId}
        eventName={event.name}
      />
    </>
  );
}
