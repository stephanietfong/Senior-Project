import React, { useEffect, useState } from "react";
import { PastEventCard, PastEvent } from "../components/PastEventCard";
import { getCurrentUser, getHostedEvents, getUserById, getRSVPCountForEvent } from "../../lib/dbQueries";

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

export const CoordinatorViewPage = () => {
  const [orgName, setOrgName] = useState("Coordinator");
  const [hostingSince, setHostingSince] = useState("—");
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
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
          setPastEvents([]);
          return;
        }

        // fetch profile from your users table (display_name, created_at)
        const profile = await getUserById(authUser.id);
        setOrgName(profile?.display_name || "Coordinator");
        setHostingSince(profile?.created_at ? formatDateShort(profile.created_at) : "—");

        // hosted events
        const hosted = await getHostedEvents(authUser.id);

        const now = new Date();
        const hostedPast = (hosted || []).filter(
          (e: any) => e?.end_time && new Date(e.end_time) < now,
        );

        // for each event, compute RSVP count (as "liked")
        const withCounts = await Promise.all(
          hostedPast.map(async (e: any) => {
            const count = await getRSVPCountForEvent(e.event_id);
            return { e, count };
          }),
        );

        const mapped: PastEvent[] = withCounts.map(
        ({ e, count }: { e: any; count: number }) => ({
            id: e.event_id,
            title: e.title,
            description: e.summary || "—",
            daysAgoText: daysAgoText(e.end_time),
            likedText: `${count} people RSVP’d`,
            tags:
            (e.event_tags || [])
                .map((et: any) => et?.tags?.tag_name)
                .filter(Boolean) || [],
            imageSrc: e.image_url || "",
        }),
        );

        setPastEvents(mapped);
      } catch (err: any) {
        setErrorMsg(err?.message || "Failed to load coordinator view.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <div className="py-4 px-20 text-black">
      <div className="my-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-customDarkBlue py-2 px-4 font-semibold hover:opacity-90"
        >
          ← Back
        </button>

        <div className="flex items-center gap-3">
          <button className="bg-customGreen py-2 font-semibold px-4 hover:opacity-90">
            Create Event +
          </button>
          <button className="bg-customDarkBlue py-2 px-4 font-semibold hover:opacity-90">
            Manage
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-black/60">Loading…</p>}
      {!loading && errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      {!loading && !errorMsg && (
        <div className="mx-auto w-full max-w-6xl flex flex-col gap-8">
          <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6 font-redhat">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-customBlue bg-black/5 text-3xl font-semibold">
                {orgName?.[0]?.toUpperCase() || "C"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-oswald text-4xl leading-tight truncate">
                  {orgName}
                </p>
                <p className="mt-1 text-sm text-black/60 italic">
                  Hosting events since {hostingSince}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="font-oswald text-3xl">Past Events</p>
              <button className="bg-customDarkBlue py-2 px-4 font-semibold hover:opacity-90">
                View Analytics
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-6">
              {pastEvents.map((e) => (
                <PastEventCard
                  key={`${e.id}`}
                  event={e}
                  onDetails={(id) => console.log("details for", id)}
                />
              ))}

              {pastEvents.length === 0 && (
                <p className="text-sm text-black/60">
                  No past hosted events found.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};