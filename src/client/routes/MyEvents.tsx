import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PastEvent, PastEventCard } from "../components/PastEventCard";
import thumbsUpIcon from "@assets/thumbs-up.png";
import blackThumbsUpIcon from "@assets/black-thumbs-up.png";
import forwardArrow from "@assets/forwardarrow.png";
import backArrow from "@assets/backarrow.png";
import { getCurrentUser } from "@lib/users";
import {
  getHostedEvents,
  getPastEvents,
  likeEvent,
  unlikeEvent,
  hasLikedEvent,
  deleteEvent,
} from "@lib/events";
import { getRSVPCountForEvent, getRSVPsForEvent } from "@/server/lib/rsvps";


function daysAgoText(endTimeIso: string) {
  const now = new Date();
  const end = new Date(endTimeIso);
  const diff = Math.floor((now.getTime() - end.getTime()) / (24 * 3600 * 1000));
  if (diff === 0) return "1 Day Ago";
  if (diff === 1) return "1 day ago";
  if (diff < 0) return `In ${diff * -1} days`;
  return `${diff} days ago`;
}

// Extended type to track original event id for edit/delete
type HostedEvent = PastEvent & { rawId: string };

export const MyEventsPage = () => {
  const navigate = useNavigate();

  const [upcomingHosted, setUpcomingHosted] = useState<HostedEvent[]>([]);
  const [pastHosted, setPastHosted] = useState<HostedEvent[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<PastEvent[]>([]);

  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const [pastHostedIndex, setPastHostedIndex] = useState(0);
  const [attendedIndex, setAttendedIndex] = useState(0);
  const [authUser, setAuthUser] = useState<any>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const authUser = await getCurrentUser();
        if (!authUser) {
          setAttendedEvents([]);
          setUpcomingHosted([]);
          setPastHosted([]);
          return;
        }

        setAuthUser(authUser);

        const hosted = await getHostedEvents(authUser.id);
        const attended = await getPastEvents(authUser.id);

        const likedStatuses = await Promise.all(
          attended.map((e: any) => hasLikedEvent(authUser.id, e.event_id)),
        );

        const mappedHosted: HostedEvent[] = await Promise.all(
          hosted.map(async (e: any) => {
            const daysAgo = daysAgoText(e.end_time);
            let likedText;
            if (daysAgo.startsWith("I")) {
              const rsvpCount = await getRSVPCountForEvent(e.event_id);
              likedText = `${rsvpCount} rsvps`;
            } else {
              likedText = `${e.likes ?? 0} Likes`;
            }
            return {
              rawId: e.event_id,
              id: e.event_id,
              title: e.title,
              description: e.summary || "—",
              daysAgoText: daysAgo,
              likedText,
              tags:
                (e.event_tags || [])
                  .map((et: any) => et?.tags?.tag_name)
                  .filter(Boolean) || [],
              imageSrc: e.image_url || "",
              liked: false,
            };
          }),
        );

        const upcoming = mappedHosted.filter((e) => e.daysAgoText.startsWith("I"));
        const past = mappedHosted.filter((e) => !e.daysAgoText.startsWith("I"));

        const mappedAttended: PastEvent[] = (attended || []).map(
          (e: any, index: number) => ({
            id: e.event_id,
            title: e.title,
            description: e.summary || "—",
            daysAgoText: daysAgoText(e.end_time),
            likedText: e.likes ? `${e.likes} Likes` : "0 Likes",
            tags:
              (e.event_tags || [])
                .map((et: any) => et?.tags?.tag_name)
                .filter(Boolean) || [],
            imageSrc: e.image_url || "",
            liked: likedStatuses[index],
          }),
        );

        setUpcomingHosted(upcoming);
        setPastHosted(past);
        setAttendedEvents(mappedAttended);
        setUpcomingIndex(0);
        setPastHostedIndex(0);
        setAttendedIndex(0);
      } catch (err: any) {
        // silent
      }
    };

    run();
  }, []);

  const handleDelete = async (event: HostedEvent) => {
    const confirmed = confirm(
      `Are you sure you want to delete "${event.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const rsvps = await getRSVPsForEvent(event.rawId);
      const emails: string[] = (rsvps || [])
        .map((r: any) => r.user?.email)
        .filter(Boolean);

      await Promise.all(
        emails.map((email) =>
          fetch("http://localhost:5000/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: email,
              subject: `Event Cancelled: ${event.title}`,
              text: `We're sorry to let you know that the event "${event.title}" has been cancelled by the host.`,
            }),
          })
        )
      );

      await deleteEvent(event.rawId);

      setUpcomingHosted((prev) => {
        const updated = prev.filter((e) => e.rawId !== event.rawId);
        setUpcomingIndex((i) => Math.min(i, Math.max(0, updated.length - 1)));
        return updated;
      });
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Failed to delete event. Please try again.");
    }
  };

  const handleUpcomingBack = () =>
    setUpcomingIndex((prev) => (upcomingHosted.length === 0 ? 0 : (prev - 1 + upcomingHosted.length) % upcomingHosted.length));
  const handleUpcomingForward = () =>
    setUpcomingIndex((prev) => (upcomingHosted.length === 0 ? 0 : (prev + 1) % upcomingHosted.length));

  const handlePastHostedBack = () =>
    setPastHostedIndex((prev) => (pastHosted.length === 0 ? 0 : (prev - 1 + pastHosted.length) % pastHosted.length));
  const handlePastHostedForward = () =>
    setPastHostedIndex((prev) => (pastHosted.length === 0 ? 0 : (prev + 1) % pastHosted.length));

  const handleAttendedBack = () =>
    setAttendedIndex((prev) => (attendedEvents.length === 0 ? 0 : (prev - 1 + attendedEvents.length) % attendedEvents.length));
  const handleAttendedForward = () =>
    setAttendedIndex((prev) => (attendedEvents.length === 0 ? 0 : (prev + 1) % attendedEvents.length));

  const handleLike = async () => {
    if (!authUser || attendedEvents.length === 0) return;
    const currentEvent = attendedEvents[attendedIndex];
    const newLiked = !currentEvent.liked;
    // Optimistically update UI
    setAttendedEvents((prev) =>
      prev.map((e, i) =>
        i === attendedIndex
          ? {
              ...e,
              liked: newLiked,
              likedText: newLiked
                ? `${parseInt(e.likedText.split(" ")[0]) + 1} Likes`
                : `${Math.max(0, parseInt(e.likedText.split(" ")[0]) - 1)} Likes`,
            }
          : e,
      ),
    );
    try {
      if (newLiked) {
        await likeEvent(authUser.id, currentEvent.id);
      } else {
        await unlikeEvent(authUser.id, currentEvent.id);
      }
    } catch (error) {
      // Revert on error
      setAttendedEvents((prev) =>
        prev.map((e, i) =>
          i === attendedIndex
            ? {
                ...e,
                liked: !newLiked,
                likedText: !newLiked
                  ? `${parseInt(e.likedText.split(" ")[0]) + 1} Likes`
                  : `${Math.max(0, parseInt(e.likedText.split(" ")[0]) - 1)} Likes`,
              }
            : e,
        ),
      );
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <>
      <style>{`
        .carousel {
          margin: 15px;
          display: flex;
          gap: 20px;
          align-items: center;
          height: 250px;
        }
      `}</style>
      <div
        className="py-10 px-6 text-black"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* SECTION 1: Upcoming Events Hosted by Me */}
        <h1 className="subheader-text">Upcoming Events Hosted by Me</h1>
        <div className="carousel">
          <button onClick={handleUpcomingBack} disabled={upcomingHosted.length <= 1}>
            <img src={backArrow} alt="Back" style={{ width: "40px", height: "40px" }} />
          </button>
          {upcomingHosted.length > 0 ? (
            <div className="flex flex-col items-center gap-3">
              <PastEventCard key={upcomingHosted[upcomingIndex].rawId} event={upcomingHosted[upcomingIndex]} />
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/edit-event/${upcomingHosted[upcomingIndex].rawId}`)}
                  className="px-6 py-2 rounded bg-customDarkBlue text-white font-semibold hover:opacity-80 transition-opacity"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(upcomingHosted[upcomingIndex])}
                  className="px-6 py-2 rounded bg-red-500 text-white font-semibold hover:opacity-80 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <span>No upcoming hosted events.</span>
          )}
          <button onClick={handleUpcomingForward} disabled={upcomingHosted.length <= 1}>
            <img src={forwardArrow} alt="Next" style={{ width: "40px", height: "40px" }} />
          </button>
        </div>

        {/* SECTION 2: Past Events Hosted by Me */}
        <h1 className="subheader-text">Past Events Hosted by Me</h1>
        <div className="carousel">
          <button onClick={handlePastHostedBack} disabled={pastHosted.length <= 1}>
            <img src={backArrow} alt="Back" style={{ width: "40px", height: "40px" }} />
          </button>
          {pastHosted.length > 0 ? (
            <PastEventCard key={pastHosted[pastHostedIndex].rawId} event={pastHosted[pastHostedIndex]} />
          ) : (
            <span>No past hosted events.</span>
          )}
          <button onClick={handlePastHostedForward} disabled={pastHosted.length <= 1}>
            <img src={forwardArrow} alt="Next" style={{ width: "40px", height: "40px" }} />
          </button>
        </div>

        {/* SECTION 3: Events I Have Attended */}
        <h1 className="subheader-text">Events I Have Attended</h1>
        <div className="carousel">
          <button
            onClick={handleAttendedBack}
            disabled={attendedEvents.length <= 1}
          >
            <img
              src={backArrow}
              alt="Back"
              style={{ width: "40px", height: "40px" }}
            />
          </button>
          {attendedEvents.length > 0 ? (
            <PastEventCard
              key={attendedEvents[attendedIndex].id}
              event={attendedEvents[attendedIndex]}
            />
          ) : (
            <span>No attended events found.</span>
          )}
          <button
            onClick={handleAttendedForward}
            disabled={attendedEvents.length <= 1}
          >
            <img
              src={forwardArrow}
              alt="Next"
              style={{ width: "40px", height: "40px" }}
            />
          </button>
        </div>
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleLike}
        >
          <img
            src={
              attendedEvents[attendedIndex]?.liked || hovered
                ? blackThumbsUpIcon
                : thumbsUpIcon
            }
            alt="Thumbs Up"
            style={{ width: "40px", height: "40px" }}
          />
        </button>
      </div>
    </>
  );
};
