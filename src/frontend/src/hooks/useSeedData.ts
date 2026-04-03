import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { PersonRole } from "../backend";
import { useActor } from "./useActor";
import { useGetAllEvents } from "./useQueries";

const SEED_KEY = "eventhub_seeded_v1";

export function useSeedData() {
  const { actor, isFetching } = useActor();
  const { data: events, isLoading: eventsLoading } = useGetAllEvents();
  const seeding = useRef(false);
  const qc = useQueryClient();

  useEffect(() => {
    if (isFetching || eventsLoading || !actor || seeding.current) return;
    if (sessionStorage.getItem(SEED_KEY)) return;
    if (events && events.length > 0) {
      sessionStorage.setItem(SEED_KEY, "true");
      return;
    }

    seeding.current = true;
    sessionStorage.setItem(SEED_KEY, "true");

    const seedAll = async () => {
      try {
        // Event 1: TechSummit 2026
        const e1Id = await actor.createEvent({
          name: "TechSummit 2026",
          date: "2026-06-15",
          location: "San Francisco Convention Center, CA",
          description:
            "The premier annual gathering of technology leaders, innovators, and visionaries. Featuring groundbreaking keynotes, hands-on workshops, and networking with 5,000+ tech professionals.",
          image: "/assets/generated/event-techsummit.dim_800x400.jpg",
        });

        // Event 2: InnovationFest
        const e2Id = await actor.createEvent({
          name: "InnovationFest 2026",
          date: "2026-07-22",
          location: "Austin Creative Campus, TX",
          description:
            "A three-day immersive festival celebrating creativity, design, and emerging technology. Interactive exhibits, live performances, and collaborative workshops for creators of all kinds.",
          image: "/assets/generated/event-innovationfest.dim_800x400.jpg",
        });

        // Event 3: BizLeadership Summit
        const e3Id = await actor.createEvent({
          name: "Business Leadership Summit",
          date: "2026-09-10",
          location: "New York Midtown Conference Center, NY",
          description:
            "An exclusive summit bringing together C-suite executives and business leaders to explore emerging market strategies, sustainable growth, and the future of global enterprise.",
          image: "/assets/generated/event-bizleadership.dim_800x400.jpg",
        });

        // Speakers & Celebs for Event 1
        await Promise.all([
          actor.createPerson({
            eventId: e1Id,
            name: "Dr. Aria Chen",
            role: PersonRole.speaker,
            bio: "AI Research Director at NeuralCore Labs. Pioneer in large language models and responsible AI development with 15+ years of industry experience.",
            photoUrl: "/assets/generated/speaker-female1.dim_200x200.jpg",
          }),
          actor.createPerson({
            eventId: e1Id,
            name: "Marcus Reid",
            role: PersonRole.speaker,
            bio: "CTO of CloudScale Systems. Expert in distributed systems and cloud-native architecture. Author of 'The Scalability Handbook'.",
            photoUrl: "/assets/generated/speaker-male1.dim_200x200.jpg",
          }),
          actor.createPerson({
            eventId: e1Id,
            name: "Kevin Zhang",
            role: PersonRole.celebrity,
            bio: "Serial entrepreneur and tech investor. Co-founder of three unicorn startups. Host of the '10x Founders' podcast with 2M+ listeners.",
            photoUrl: "/assets/generated/celebrity-male1.dim_200x200.jpg",
          }),
        ]);

        // Speakers & Celebs for Event 2
        await Promise.all([
          actor.createPerson({
            eventId: e2Id,
            name: "Sofia Martinez",
            role: PersonRole.speaker,
            bio: "Chief Design Officer at Visionary Studios. Award-winning UX designer and advocate for inclusive product design worldwide.",
            photoUrl: "/assets/generated/speaker-female1.dim_200x200.jpg",
          }),
          actor.createPerson({
            eventId: e2Id,
            name: "James Okafor",
            role: PersonRole.celebrity,
            bio: "Grammy-nominated musician and tech entrepreneur. Founder of SoundBridge, a platform connecting artists with cutting-edge music production tools.",
            photoUrl: "/assets/generated/celebrity-male1.dim_200x200.jpg",
          }),
        ]);

        // Speakers & Celebs for Event 3
        await Promise.all([
          actor.createPerson({
            eventId: e3Id,
            name: "Linda Park",
            role: PersonRole.speaker,
            bio: "CEO of GlobalVentures Group. Forbes 50 Most Powerful Women in Business. Keynote speaker on sustainable enterprise and ESG strategy.",
            photoUrl: "/assets/generated/speaker-female1.dim_200x200.jpg",
          }),
          actor.createPerson({
            eventId: e3Id,
            name: "David Mercer",
            role: PersonRole.celebrity,
            bio: "Best-selling author of 'The Exponential Executive'. Former Fortune 500 CEO turned executive coach and sought-after motivational speaker.",
            photoUrl: "/assets/generated/celebrity-male1.dim_200x200.jpg",
          }),
        ]);

        // Timetable for Event 1
        await Promise.all([
          actor.createTimetableEntry({
            eventId: e1Id,
            time: "09:00 AM",
            topic: "Opening Keynote: The Next Decade of AI",
            speakerName: "Dr. Aria Chen",
          }),
          actor.createTimetableEntry({
            eventId: e1Id,
            time: "11:00 AM",
            topic: "Building Resilient Cloud Architectures",
            speakerName: "Marcus Reid",
          }),
          actor.createTimetableEntry({
            eventId: e1Id,
            time: "02:00 PM",
            topic: "Fireside Chat: Lessons from the Startup Trenches",
            speakerName: "Kevin Zhang",
          }),
          actor.createTimetableEntry({
            eventId: e1Id,
            time: "04:00 PM",
            topic: "Panel: Future of Human-Computer Interaction",
          }),
          actor.createTimetableEntry({
            eventId: e1Id,
            time: "06:00 PM",
            topic: "Networking Reception & Demo Showcase",
          }),
        ]);

        // Timetable for Event 2
        await Promise.all([
          actor.createTimetableEntry({
            eventId: e2Id,
            time: "10:00 AM",
            topic: "Design Thinking Workshop: Build for Everyone",
            speakerName: "Sofia Martinez",
          }),
          actor.createTimetableEntry({
            eventId: e2Id,
            time: "01:00 PM",
            topic: "Live Performance & Creative Tech Demo",
            speakerName: "James Okafor",
          }),
          actor.createTimetableEntry({
            eventId: e2Id,
            time: "03:30 PM",
            topic: "Interactive Exhibit: Art Meets Algorithm",
          }),
        ]);

        // Timetable for Event 3
        await Promise.all([
          actor.createTimetableEntry({
            eventId: e3Id,
            time: "08:30 AM",
            topic: "Breakfast Briefing: Global Market Outlook 2026",
          }),
          actor.createTimetableEntry({
            eventId: e3Id,
            time: "10:00 AM",
            topic: "Keynote: Leading Through Disruption",
            speakerName: "Linda Park",
          }),
          actor.createTimetableEntry({
            eventId: e3Id,
            time: "12:00 PM",
            topic: "Luncheon Keynote: The Exponential Executive",
            speakerName: "David Mercer",
          }),
          actor.createTimetableEntry({
            eventId: e3Id,
            time: "03:00 PM",
            topic: "Roundtable: ESG and Stakeholder Capitalism",
          }),
        ]);

        await qc.invalidateQueries({ queryKey: ["events"] });
      } catch (err) {
        console.error("Seed error:", err);
      }
    };

    seedAll();
  }, [actor, isFetching, events, eventsLoading, qc]);
}
