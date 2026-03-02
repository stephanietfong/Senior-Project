// src/routes/EventDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createOrUpdateRSVP,
  deleteRSVP,
  getCurrentUser,
  getEventById,
  getUserRSVPStatusForEvent,
} from "../../lib/dbQueries";

type RSVPStatus = "Going" | "Maybe" | undefined;

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString([], {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const TagPill = ({ text }: { text: string }) => (
  <span className="rounded-full bg-customBlue/80 px-3 py-1 text-xs text-black">
    {text}
  </span>
);

export const EventDetailsPage = () => {
  const nav = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [event, setEvent] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>(undefined);
  const [saving, setSaving] = useState(false);

  const tags: string[] = useMemo(() => {
    if (!event?.event_tags) return [];
    return (event.event_tags as any[])
      .map((et) => et?.tag?.tag_name)
      .filter(Boolean);
  }, [event]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        if (!eventId) {
          setErrorMsg("Missing eventId.");
          return;
        }

        const [authUser, ev] = await Promise.all([
          getCurrentUser(),
          getEventById(eventId),
        ]);

        setEvent(ev);

        if (authUser?.id) {
          setUserId(authUser.id);
          const status = await getUserRSVPStatusForEvent(authUser.id, eventId);
          setRsvpStatus(status);
        } else {
          setUserId(null);
          setRsvpStatus(undefined);
        }
      } catch (err: any) {
        setErrorMsg(err?.message || "Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [eventId]);

  const onSetRSVP = async (status: "Going" | "Maybe") => {
    if (!userId || !eventId) {
      setErrorMsg("Please log in to RSVP.");
      return;
    }
    try {
      setSaving(true);
      setErrorMsg(null);
      await createOrUpdateRSVP(userId, eventId, status);
      setRsvpStatus(status);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to update RSVP.");
    } finally {
      setSaving(false);
    }
  };

  const onRemoveRSVP = async () => {
    if (!userId || !eventId) return;
    try {
      setSaving(true);
      setErrorMsg(null);
      await deleteRSVP(userId, eventId);
      setRsvpStatus(undefined);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to remove RSVP.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-4 px-20 text-black">
      {/* top row */}
      <div className="my-10 flex items-center justify-between">
        <button
          className="bg-customDarkBlue py-2 px-4 font-semibold hover:opacity-90"
          onClick={() => nav(-1)}
        >
          ← Back
        </button>

        <div className="flex items-center gap-3">
          <button
            className="bg-customGreen py-2 px-4 font-semibold hover:opacity-90 disabled:opacity-50"
            disabled={saving || rsvpStatus === "Going"}
            onClick={() => onSetRSVP("Going")}
          >
            {rsvpStatus === "Going" ? "Going ✓" : "Mark Going"}
          </button>

          <button
            className="bg-customGreen py-2 px-4 font-semibold hover:opacity-90 disabled:opacity-50"
            disabled={saving || rsvpStatus === "Maybe"}
            onClick={() => onSetRSVP("Maybe")}
          >
            {rsvpStatus === "Maybe" ? "Maybe ✓" : "Mark Maybe"}
          </button>

          <button
            className="bg-customDarkBlue py-2 px-4 font-semibold hover:opacity-90 disabled:opacity-50"
            disabled={saving || !rsvpStatus}
            onClick={onRemoveRSVP}
          >
            Remove RSVP
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-black/60">Loading…</p>}
      {!loading && errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      {!loading && !errorMsg && event && (
        <div className="mx-auto w-full max-w-6xl flex flex-col gap-8">
          {/* hero */}
          <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6 font-redhat">
            <div className="grid grid-cols-[280px,1fr] gap-6">
              {/* image */}
              <div className="w-full h-[200px] rounded-2xl border border-black/10 overflow-hidden bg-black/5 flex items-center justify-center">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-black/40">No Image</span>
                )}
              </div>

              {/* main */}
              <div className="min-w-0 flex flex-col gap-3">
                <p className="font-oswald text-5xl leading-tight truncate">
                  {event.title}
                </p>

                <div className="text-sm text-black/70 flex flex-col gap-1">
                  <p className="italic">
                    Hosted by{" "}
                    <span className="font-semibold text-black/80">
                      {event.host?.display_name || "Unknown host"}
                    </span>
                  </p>
                  <p>
                    {formatDateTime(event.start_time)} →{" "}
                    {formatDateTime(event.end_time)}
                  </p>
                  <p>
                    {event.location_name || "TBA"}
                    {event.address ? ` • ${event.address}` : ""}
                  </p>
                  <p>
                    {event.is_18_plus ? "18+ " : ""}
                    {event.is_21_plus ? "21+ " : ""}
                    {event.capacity ? `Capacity: ${event.capacity}` : ""}
                  </p>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {tags.map((t) => (
                      <TagPill key={t} text={t} />
                    ))}
                  </div>
                )}

                {event.summary && (
                  <p className="text-sm text-black/80 pt-2">{event.summary}</p>
                )}
              </div>
            </div>
          </div>

          {/* small status card */}
          <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6 font-redhat">
            <p className="font-oswald text-2xl">Your RSVP</p>
            <p className="text-sm text-black/70 mt-2">
              {userId
                ? rsvpStatus
                  ? `You are marked as: ${rsvpStatus}`
                  : "You have not RSVP’d yet."
                : "Log in to RSVP to this event."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};