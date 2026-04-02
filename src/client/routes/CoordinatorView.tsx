import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PastEventCard, PastEvent } from "@components/PastEventCard";
import { getCurrentUser, getUserById } from "@lib/users";
import { getHostedEvents } from "@lib/events";
import { getRSVPCountForEvent } from "@lib/rsvps";

function formatDateShort(iso: string) {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = d.getFullYear();
  return `${mm}/${dd}/${yy}`;
}

function daysAgoText(endTimeIso: string) {
  const now = new Date();
  const end = new Date(endTimeIso);
  const diff = Math.floor((now.getTime() - end.getTime()) / (24 * 3600 * 1000));
  if (diff <= 0) return "Today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
}

function daysUntilText(startTimeIso: string) {
  const now = new Date();
  const start = new Date(startTimeIso);
  const diff = Math.ceil((start.getTime() - now.getTime()) / (24 * 3600 * 1000));
  if (diff <= 0) return "Today";
  if (diff === 1) return "In 1 day";
  return `In ${diff} days`;
}

function mapEvent(e: any, timeText: string, count: number): PastEvent {
  return {
    id: e.event_id,
    title: e.title,
    description: e.summary || "—",
    daysAgoText: timeText,
    likedText: `${count} RSVP${count !== 1 ? "s" : ""}`,
    tags: (e.event_tags || []).map((et: any) => et?.tags?.tag_name).filter(Boolean),
    imageSrc: e.image_url || "",
  };
}

export const CoordinatorViewPage = () => {
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState("Coordinator");
  const [hostingSince, setHostingSince] = useState("—");
  const [upcomingEvents, setUpcomingEvents] = useState<PastEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
  const [totalRSVPs, setTotalRSVPs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const authUser = await getCurrentUser();
        if (!authUser) {
          setErrorMsg("You must be logged in to view the coordinator page.");
          return;
        }

        const profile = await getUserById(authUser.id);
        setOrgName(profile?.display_name || "Coordinator");
        setHostingSince(
          profile?.created_at ? formatDateShort(profile.created_at) : "—",
        );

        const hosted = await getHostedEvents(authUser.id);
        const now = new Date();

        const upcoming = (hosted || []).filter(
          (e: any) => e?.start_time && new Date(e.start_time) >= now,
        );
        const past = (hosted || []).filter(
          (e: any) => e?.end_time && new Date(e.end_time) < now,
        );

        const withCounts = await Promise.all(
          [...upcoming, ...past].map(async (e: any) => {
            const count = await getRSVPCountForEvent(e.event_id);
            return { e, count };
          }),
        );

        const upcomingIds = new Set(upcoming.map((e: any) => e.event_id));
        let rsvpTotal = 0;

        const mappedUpcoming: PastEvent[] = [];
        const mappedPast: PastEvent[] = [];

        for (const { e, count } of withCounts) {
          rsvpTotal += count;
          if (upcomingIds.has(e.event_id)) {
            mappedUpcoming.push(mapEvent(e, daysUntilText(e.start_time), count));
          } else {
            mappedPast.push(mapEvent(e, daysAgoText(e.end_time), count));
          }
        }

        setUpcomingEvents(mappedUpcoming);
        setPastEvents(mappedPast);
        setTotalRSVPs(rsvpTotal);
      } catch (err: any) {
        setErrorMsg(err?.message || "Failed to load coordinator view.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const totalEvents = upcomingEvents.length + pastEvents.length;

  return (
    <div className="py-4 px-20 text-black">
      <div className="my-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-customDarkBlue py-2 px-4 font-semibold hover:opacity-90"
        >
          ← Back
        </button>

        <button className="bg-customGreen py-2 font-semibold px-4 hover:opacity-90">
          Create Event +
        </button>
      </div>

      {loading && <p className="text-sm text-black/60">Loading…</p>}
      {!loading && errorMsg && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      {!loading && !errorMsg && (
        <div className="mx-auto w-full max-w-6xl flex flex-col gap-8">

          {/* Profile + Stats */}
          <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6 font-redhat">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-customBlue bg-black/5 text-3xl font-semibold shrink-0">
                  {orgName?.[0]?.toUpperCase() || "C"}
                </div>
                <div>
                  <p className="font-oswald text-4xl leading-tight">{orgName}</p>
                  <p className="mt-1 text-sm text-black/60 italic">
                    Hosting events since {hostingSince}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="rounded-2xl bg-customBlue/30 px-6 py-4 text-center">
                  <p className="font-oswald text-4xl">{totalEvents}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-black/50">
                    Events Hosted
                  </p>
                </div>
                <div className="rounded-2xl bg-customGreen/30 px-6 py-4 text-center">
                  <p className="font-oswald text-4xl">{totalRSVPs}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-black/50">
                    Total RSVPs
                  </p>
                </div>
                <div className="rounded-2xl bg-customBrown/20 px-6 py-4 text-center">
                  <p className="font-oswald text-4xl">{upcomingEvents.length}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-black/50">
                    Upcoming
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">
            <p className="font-oswald text-3xl">Upcoming Events</p>
            <div className="mt-6 flex flex-col gap-6">
              {upcomingEvents.map((e) => (
                <PastEventCard
                  key={e.id}
                  event={e}
                  onDetails={(id) => navigate(`/events/${id}`)}
                />
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-black/60">No upcoming hosted events.</p>
              )}
            </div>
          </div>

          {/* Past Events */}
          <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">
            <p className="font-oswald text-3xl">Past Events</p>
            <div className="mt-6 flex flex-col gap-6">
              {pastEvents.map((e) => (
                <PastEventCard
                  key={e.id}
                  event={e}
                  onDetails={(id) => navigate(`/events/${id}`)}
                />
              ))}
              {pastEvents.length === 0 && (
                <p className="text-sm text-black/60">No past hosted events.</p>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
