import { useEffect, useState } from "react";
import { getCurrentUser } from "@lib/users";
import { getUpcomingRSVPEventsForUser } from "@lib/rsvps";
import { EventCard } from "@components/EventCard";
import backarrow from "@assets/backarrow.png";

export function UpcomingEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const user = await getCurrentUser();
        if (!user) {
          setEvents([]);
          setErrorMsg("You must be logged in to view your Upcoming events.");
          return;
        }

        const events = await getUpcomingRSVPEventsForUser(user.id);
        setEvents(events);
      } catch (err: any) {
        setErrorMsg(err?.message || "Failed to load upcoming events.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <div className="py-4 px-20 text-black">
      <a className="flex items-center self-start" href="/events">
        <img src={backarrow} alt="" />
        <span className="p-4 rounded-md font-semibold self-start">
          Back to All Events
        </span>
      </a>
      <h1 className="text-5xl font-bold w-full text-center font-oswald mt-[-40px] mb-10">
        My Interested Events
      </h1>

      {loading && <p className="text-sm text-black/60">Loading…</p>}
      {!loading && errorMsg && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      {!loading && !errorMsg && (
        <div className="mx-auto w-full max-w-6xl flex flex-col gap-6">
          {events.map((e) => (
            <EventCard
              key={e.event.event_id}
              id={e.event.event_id}
              name={e.event.title}
              image={e.event.image_url}
              location={e.event.location_name}
              date={e.event.start_time}
              description={e.event.summary}
            />
          ))}
        </div>
      )}
    </div>
  );
}
