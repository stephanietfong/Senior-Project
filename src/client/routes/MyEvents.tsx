import { useState, useEffect } from 'react';
import { PastEventCard } from '../components/PastEventCard';
import thumbsUpIcon from '@assets/thumbs-up.png';
import potluckPoster from '@assets/potluckPoster.png';
import festivalPoster from '@assets/musicFestival.jpg';
import forwardArrow from '@assets/forwardarrow.png';
import backArrow from '@assets/backarrow.png';


export function MyEventsPage() {

  const [hostedEvents, setHostedEvents] = useState<{ id: number; title: string; date: string; description: string; daysAgoText: string; likedText: string; tags: string[]; imageSrc: string }[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<{ id: number; title: string; date: string; description: string; daysAgoText: string; likedText: string; tags: string[]; imageSrc: string }[]>([]);

  useEffect(() => {
    
    setHostedEvents([
      { id: 1, title: "Spring Potluck", date: "2024-01-15", description: "Bring your favorite dish to share!", daysAgoText: "2 days ago", likedText: "0 likes", tags: ["Music", "Art", "Tech"], imageSrc: potluckPoster },
    ]);

    setAttendedEvents([
      { id: 2, title: "Music Festival", date: "2019-03-20", description: "Enjoy the best music and art performances from top artists.", daysAgoText: "2391 days ago", likedText: "0 likes", tags: ["Music", "Art", "21+", "Drinks"], imageSrc: festivalPoster },
    ]);
  }, []);

  return (
    <>
      <style>{`
        .carousel {
          margin: 15px;
          display: flex;
          gap: 20px;
        }
      `}</style>
      <div className="py-10 px-6 text-black" style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        <h1 className="text-5xl font-oswald">Events Hosted by Me</h1>
        <div className="carousel">
          <button><img src={backArrow} alt="Back" style={{ width: '40px', height: '40px' }}/></button>
          {hostedEvents.map((event) => (
            <PastEventCard key={event.id} event={event} />
          ))}
          <button><img src={forwardArrow} alt="Next" style={{ width: '40px', height: '40px' }}/></button>
        </div>
        <h1 className="text-5xl font-oswald">Events I Have Attended</h1>
          <div className="carousel">
          <button><img src={backArrow} alt="Back" style={{ width: '40px', height: '40px' }}/></button>
          {attendedEvents.map((event) => (
            <PastEventCard key={event.id} event={event} />
          ))}
          <button><img src={forwardArrow} alt="Next" style={{ width: '40px', height: '40px' }}/></button>
        </div>
          <button><img src={thumbsUpIcon} alt="Thumbs Up" style={{ width: '40px', height: '40px' }}/></button>
      </div>
    </>
  );
}