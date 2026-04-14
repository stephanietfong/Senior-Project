import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEventById } from "@server/lib/events";
import backarrow from "@assets/backarrow.png";
import bluebullet from "@assets/bluebullet.png";
import greenbullet from "@assets/greenbullet.png";
import { getCurrentUser } from "@/server/lib/users";
import {
  createOrUpdateRSVP,
  deleteRSVP,
  checkRSVPForSingleUserAndEvent,
} from "@/server/lib/rsvps";
import { submitReport } from "@/server/lib/reports";

const formatEventTimestamp = (timestamp?: string) => {
  if (!timestamp) return null;

  const parsedDate = new Date(timestamp);
  if (Number.isNaN(parsedDate.getTime())) return null;

  const datePart = parsedDate.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timePart = parsedDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} @ ${timePart}`;
};

const formatGoogleCalendarDate = (timestamp?: string) => {
  if (!timestamp) return null;

  const parsedDate = new Date(timestamp);
  if (Number.isNaN(parsedDate.getTime())) return null;

  // Google Calendar URL format requires UTC in YYYYMMDDTHHMMSSZ.
  return parsedDate
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
};

const buildGoogleCalendarUrl = (event: any, userEmail?: string) => {
  const params = new URLSearchParams();

  params.set("action", "TEMPLATE");
  params.set("text", event.title || "Event");

  const start = formatGoogleCalendarDate(event.start_time);
  const end = formatGoogleCalendarDate(event.end_time);
  if (start && end) {
    params.set("dates", `${start}/${end}`);
  }

  const detailsParts = [event.summary, event.description].filter(Boolean);
  if (detailsParts.length > 0) {
    params.set("details", detailsParts.join("\n\n"));
  }

  const location = event.address || event.location_name;
  if (location) {
    params.set("location", location);
  }

  if (userEmail) {
    params.set("authuser", userEmail);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [interested, setInterested] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportDone, setReportDone] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const mapQuery = event.address || event.location_name || "";
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
    | string
    | undefined;
  const mapEmbedUrl = mapQuery
    ? googleMapsApiKey
      ? `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(mapQuery)}`
      : `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`
    : null;

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (id) {
          const event = await getEventById(id.toString());
          if (event) {
            setEvent(event);
            console.log(event);
          }
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentUserAndInterest = async () => {
      try {
        let u = await getCurrentUser();
        setUser(u);

        if (u && id) {
          let i = await checkRSVPForSingleUserAndEvent(
            u.id.toString(),
            id.toString(),
          );
          setInterested(i);
        }
      } catch (error) {
        console.error("Error fetching current user and interest:", error);
      }
    };
    fetchEventDetails();
    fetchCurrentUserAndInterest();
  }, [id]);

  const handleAddInterest = async () => {
    try {
      if (id) {
        await createOrUpdateRSVP(user.id.toString(), id.toString());
        setInterested(true);

        const calendarUrl = buildGoogleCalendarUrl(event, user?.email);
        window.open(calendarUrl, "_blank");
      }
    } catch (error) {
      console.error("Error creating RSVP:", error);
    }
  };

  const handleReport = async () => {
    if (!reportReason) return;
    setReportSubmitting(true);
    setReportError(null);
    try {
      await submitReport(user?.id, id!.toString(), reportReason);
      setReportDone(true);
      setReportOpen(false);
    } catch (e: any) {
      setReportError(
        e.message?.includes("unique")
          ? "You have already reported this event."
          : e.message || "Failed to submit report.",
      );
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleRemoveInterest = async () => {
    try {
      if (id) {
        await deleteRSVP(user.id.toString(), id.toString());
        setInterested(false);
      }
    } catch (error) {
      console.error("Error deleting RSVP:", error);
    }
  };

  if (loading) {
    return <p>Loading ...</p>;
  }

  return (
    <div className="px-20 py-10 text-black flex flex-col justify-center items-center font-redhat gap-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="button-style bg-customGreen hover:bg-customGreen/50 flex items-center self-start"
      >
        ← Back
      </button>
      <h1 className="subheader-text mt-[-40px]">{event.title}</h1>
      <div className="flex flex-row gap-10 items-center justify-center">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={`Event: ${event.title}`}
            className="w-[36rem] shadow-lg"
          />
        ) : (
          <div className="w-[36rem] h-[36rem] bg-gray-200 flex items-center justify-center shadow-lg">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
        <div className="flex flex-col p-10 gap-6">
          <ul className="gap-2 flex flex-col">
            <li className="flex items-center gap-2">
              <img src={bluebullet} alt="" className="w-6 h-6" />
              <p className="text-lg">
                Hosted by:{" "}
                <span className="font-medium">
                  {event.host ? event.host.display_name : "Unknown Host"}
                </span>
              </p>
            </li>
            <li className="flex items-center gap-2">
              <img src={greenbullet} alt="" className="w-6 h-6" />
              <p className="text-lg">
                Occurs between{" "}
                <span className="font-medium">
                  {formatEventTimestamp(event.start_time) ??
                    "Unknown Start Time"}
                </span>{" "}
                and{" "}
                <span className="font-medium">
                  {formatEventTimestamp(event.end_time) ?? "Unknown End Time"}
                </span>
              </p>
            </li>
          </ul>
          <p className="bg-customGray p-8 max-w-4xl">
            {event.summary
              ?.replace(/[\u2018\u2019]/g, "'")
              .replace(/[\u201C\u201D]/g, '"')}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <p className="subheader-text">Location</p>
        {mapEmbedUrl ? (
          <iframe
            title="Event location map"
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-[36rem] h-80 rounded"
          />
        ) : (
          <p className="text-sm text-black/60">
            Map unavailable for this event.
          </p>
        )}
      </div>

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-customBeige rounded-2xl border border-black/10 shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
            <h2 className="font-oswald text-2xl">Report Event</h2>
            <p className="font-redhat text-sm text-black/60">
              Select a reason for reporting this event.
            </p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 font-redhat text-base outline-none"
            >
              <option value="">Select a reason...</option>
              <option value="Inappropriate content">
                Inappropriate content
              </option>
              <option value="Spam">Spam</option>
              <option value="Offensive image">Offensive image</option>
              <option value="Misleading information">
                Misleading information
              </option>
              <option value="Other">Other</option>
            </select>
            {reportError && (
              <p className="text-sm text-red-600">{reportError}</p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setReportOpen(false);
                  setReportReason("");
                  setReportError(null);
                }}
                className="px-5 py-2 rounded-full border border-black/15 font-semibold hover:opacity-80"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason || reportSubmitting}
                className="px-5 py-2 rounded-full bg-customBrown text-white font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {reportSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}

      {reportDone && (
        <p className="text-sm text-green-600 font-redhat">
          Thank you — your report has been submitted.
        </p>
      )}

      <div className="flex flex-col items-center gap-3">
        {interested ? (
          <button
            className="button-style bg-customGreen text-white"
            onClick={() => handleRemoveInterest()}
          >
            You've marked your interest in this event. Click to unmark your
            interest.
          </button>
        ) : (
          <button
            className="bg-customDarkBlue button-style text-white"
            onClick={() => handleAddInterest()}
          >
            Mark this event as Interested!
          </button>
        )}
        {user && !reportDone && (
          <button
            onClick={() => setReportOpen(true)}
            className="text-sm text-black/40 hover:text-customBrown underline"
          >
            Report this event
          </button>
        )}
      </div>
    </div>
  );
};
