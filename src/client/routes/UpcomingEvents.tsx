import { useEffect, useMemo, useState } from "react";
import { UpcomingEventCard, UpcomingEvent } from "../components/UpcomingEventCard";
import { getCurrentUser, getUpcomingRSVPEventsForUser } from "../../lib/dbQueries";

function daysAwayText(startTimeIso: string) {
  const now = new Date();
  const start = new Date(startTimeIso);
  const diff = Math.ceil((start.getTime() - now.getTime()) / (24 * 3600 * 1000));
  if (diff <= 0) return "Today";
  if (diff === 1) return "In 1 day";
  return `In ${diff} days`;
}

function mapRowToUpcomingEvent(row: any): UpcomingEvent {
  const e = row.event;

  // pick something sensible for "orgOrVenue"
  const orgOrVenue =
    e?.host?.display_name ||
    e?.location_name ||
    "Unknown host";

  const address =
    e?.address ||
    e?.location_name ||
    "TBA";

  return {
    id: e.event_id, // note: your card type says number; but DB is uuid.
    // If TS complains, change UpcomingEventCard type id to string | number.
    title: e.title,
    orgOrVenue,
    address,
    description: e.summary || "",
    daysAwayText: daysAwayText(e.start_time),
    imageSrc: e.image_url || "",
    onDetails: () => alert(`TODO: Details for ${e.title}`),
  } as unknown as UpcomingEvent;
}

export function UpcomingEventsPage() {
  const [search, setSearch] = useState("");
  const [going, setGoing] = useState<UpcomingEvent[]>([]);
  const [maybe, setMaybe] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const user = await getCurrentUser();
        if (!user) {
          setGoing([]);
          setMaybe([]);
          setErrorMsg("You must be logged in to view your Upcoming events.");
          return;
        }

        const rows = await getUpcomingRSVPEventsForUser(user.id);

        const goingEvents = rows
          .filter((r: any) => r.status === "Going")
          .map(mapRowToUpcomingEvent);

        const maybeEvents = rows
          .filter((r: any) => r.status === "Maybe")
          .map(mapRowToUpcomingEvent);

        setGoing(goingEvents);
        setMaybe(maybeEvents);
      } catch (err: any) {
        setErrorMsg(err?.message || "Failed to load upcoming events.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const matches = (e: UpcomingEvent) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      e.title.toLowerCase().includes(q) ||
      e.orgOrVenue.toLowerCase().includes(q) ||
      e.address.toLowerCase().includes(q)
    );
  };

  const goingFiltered = useMemo(() => going.filter(matches), [going, search]);
  const maybeFiltered = useMemo(() => maybe.filter(matches), [maybe, search]);

  return (
    <div className="py-4 px-20 text-black">
      <div className="my-10 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search Upcoming Events"
          className="rounded-full p-2 bg-customDarkBlue placeholder:text-gray-900 w-1/2 focus:outline-none focus:ring-0 focus:border-none"
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="bg-customDarkBlue py-2 px-4 font-semibold hover:opacity-90"
          onClick={() => window.history.back()}
        >
          ← Back to Search
        </button>
      </div>

      {loading && <p className="text-sm text-black/60">Loading…</p>}
      {!loading && errorMsg && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      {!loading && !errorMsg && (
        <div className="mx-auto w-full max-w-6xl flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <p className="font-oswald text-4xl">Going</p>
            <div className="flex flex-col gap-6">
              {goingFiltered.map((e) => (
                <UpcomingEventCard key={`${e.id}`} {...e} />
              ))}
              {goingFiltered.length === 0 && (
                <p className="text-sm text-black/60">No events in Going.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <p className="font-oswald text-4xl">Maybe</p>
            <div className="flex flex-col gap-6">
              {maybeFiltered.map((e) => (
                <UpcomingEventCard key={`${e.id}`} {...e} />
              ))}
              {maybeFiltered.length === 0 && (
                <p className="text-sm text-black/60">No events in Maybe.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}