import { useState, useEffect } from 'react';
import { PastEvent, PastEventCard } from '../components/PastEventCard';
import thumbsUpIcon from '@assets/thumbs-up.png';
import blackThumbsUpIcon from '@assets/black-thumbs-up.png';
import forwardArrow from '@assets/forwardarrow.png';
import backArrow from '@assets/backarrow.png';
import { getCurrentUser } from "@lib/users";
import { getHostedEvents, getPastEvents, likeEvent, unlikeEvent, hasLikedEvent } from "@lib/events";
import { getRSVPCountForEvent, getRSVPsForEvent } from '@/server/lib/rsvps';


function daysAgoText(endTimeIso: string) {
  const now = new Date();
  const end = new Date(endTimeIso);
  const diff = Math.floor((now.getTime() - end.getTime()) / (24 * 3600 * 1000));
  if (diff === 0) return "1 Day Ago";
  if (diff === 1) return "1 day ago";
  if (diff < 0) return `In ${diff * -1} days`;
  return `${diff} days ago`;
}

export const MyEventsPage = () => {

  const [hostedEvents, setHostedEvents] = useState<PastEvent[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<PastEvent[]>([]);
  const [hostedIndex, setHostedIndex] = useState(0);
  const [attendedIndex, setAttendedIndex] = useState(0);
  const [authUser, setAuthUser] = useState<any>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
      

        const authUser = await getCurrentUser();
        if (!authUser) {
          setAttendedEvents([]);
          setHostedEvents([]);
          return;
        }

        setAuthUser(authUser);

        const hosted = await getHostedEvents(authUser.id);
        const attended = await getPastEvents(authUser.id);
        const now = new Date();

        const likedStatuses = await Promise.all(attended.map((e: any) => hasLikedEvent(authUser.id, e.event_id)));

        const mappedHosted: PastEvent[] = await Promise.all(
        hosted.map(async (e: any) => {
          const daysAgo = daysAgoText(e.end_time);

          let likedText;

          if (daysAgo.startsWith("I")) {
            // Event is upcoming → show RSVPs
            const rsvpCount = await getRSVPCountForEvent(e.event_id);
            likedText = `${rsvpCount} rsvps`;
          } else {
            // Event is past → show likes
            likedText = `${e.likes ?? 0} Likes`;
          }

          return {
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
        })
      );

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

        setHostedEvents(mappedHosted);
        setAttendedEvents(mappedAttended);
        setHostedIndex(0);
        setAttendedIndex(0);
      } catch (err: any) {
        
      } finally {
        
      }
    };

    run();
  }, []);

  const handleHostedBack = () => {
    setHostedIndex((prev) => (hostedEvents.length === 0 ? 0 : (prev - 1 + hostedEvents.length) % hostedEvents.length));
  };
  const handleHostedForward = () => {
    setHostedIndex((prev) => (hostedEvents.length === 0 ? 0 : (prev + 1) % hostedEvents.length));
  };
  const handleAttendedBack = () => {
    setAttendedIndex((prev) => (attendedEvents.length === 0 ? 0 : (prev - 1 + attendedEvents.length) % attendedEvents.length));
  };
  const handleAttendedForward = () => {
    setAttendedIndex((prev) => (attendedEvents.length === 0 ? 0 : (prev + 1) % attendedEvents.length));
  };

  const handleLike = async () => {
    if (!authUser || attendedEvents.length === 0) return;
    const currentEvent = attendedEvents[attendedIndex];
    const newLiked = !currentEvent.liked;
    // Optimistically update UI
    setAttendedEvents(prev => prev.map((e, i) => i === attendedIndex ? { ...e, liked: newLiked, likedText: newLiked ? `${parseInt(e.likedText.split(' ')[0]) + 1} Likes` : `${Math.max(0, parseInt(e.likedText.split(' ')[0]) - 1)} Likes` } : e));
    try {
      if (newLiked) {
        await likeEvent(authUser.id, currentEvent.id);
      } else {
        await unlikeEvent(authUser.id, currentEvent.id);
      }
    } catch (error) {
      // Revert on error
      setAttendedEvents(prev => prev.map((e, i) => i === attendedIndex ? { ...e, liked: !newLiked, likedText: !newLiked ? `${parseInt(e.likedText.split(' ')[0]) + 1} Likes` : `${Math.max(0, parseInt(e.likedText.split(' ')[0]) - 1)} Likes` } : e));
      console.error('Failed to toggle like:', error);
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
      <div className="py-10 px-6 text-black" style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        <h1 className="text-5xl font-oswald">Events Hosted by Me</h1>
        <div className="carousel">
          <button onClick={handleHostedBack} disabled={hostedEvents.length <= 1}><img src={backArrow} alt="Back" style={{ width: '40px', height: '40px' }}/></button>
          {hostedEvents.length > 0 ? (
            <PastEventCard key={hostedEvents[hostedIndex].id} event={hostedEvents[hostedIndex]} />
          ) : (
            <span>No hosted events found.</span>
          )}
          <button onClick={handleHostedForward} disabled={hostedEvents.length <= 1}><img src={forwardArrow} alt="Next" style={{ width: '40px', height: '40px' }}/></button>
        </div>
        <h1 className="text-5xl font-oswald">Events I Have Attended</h1>
          <div className="carousel">
          <button onClick={handleAttendedBack} disabled={attendedEvents.length <= 1}><img src={backArrow} alt="Back" style={{ width: '40px', height: '40px' }}/></button>
          {attendedEvents.length > 0 ? (
            <PastEventCard key={attendedEvents[attendedIndex].id} event={attendedEvents[attendedIndex]} />
          ) : (
            <span>No attended events found.</span>
          )}
          <button onClick={handleAttendedForward} disabled={attendedEvents.length <= 1}><img src={forwardArrow} alt="Next" style={{ width: '40px', height: '40px' }}/></button>
        </div>
          <button onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={handleLike}><img src={(attendedEvents[attendedIndex]?.liked || hovered) ? blackThumbsUpIcon : thumbsUpIcon} alt="Thumbs Up" style={{ width: '40px', height: '40px' }}/></button>
      </div>
    </>
  );
}