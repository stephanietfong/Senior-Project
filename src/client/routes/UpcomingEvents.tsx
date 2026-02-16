import React from "react";
import { EventSection } from "../components/EventSection";
import type { UpcomingEvent } from "../components/UpcomingEventCard";
import "../styles/upcomingEvents.css";

export const UpcomingEventsPage: React.FC = () => {
  // Temporary sample data 
  const going: UpcomingEvent[] = [
    {
      id: "1",
      title: "Swamphacks",
      locationLine1: "University of Florida",
      locationLine2: "Gainesville, FL",
      description: "Description  ————————————————",
      startsInText: "In 6 days",
      imageUrl:
        "",
    },
    {
      id: "2",
      title: "Ropin in the Swamp",
      locationLine1: "1934 SW 63rd Ave",
      locationLine2: "Gainesville, FL",
      description: "Description  ————————————————",
      startsInText: "In 9 days",
      imageUrl:
        "",
    },
  ];

  const maybe: UpcomingEvent[] = [
    {
      id: "3",
      title: "Country Line Dancing",
      locationLine1: "Vivid Music Hall",
      locationLine2: "Gainesville, FL",
      description: "Description  ————————————————",
      startsInText: "In 8 days",
      imageUrl:
        "",
    },
  ];

  const onDetails = (eventId: string) => {
    // Laterrrr will navigate to /events/:id or open modal
    alert(`Details clicked forevent ${eventId}`);
  };

  return (
    <div className="upcomingPage">
      <header className="upcomingHeader">
        <h1 className="upcomingTitle">Upcoming Events</h1>

        <a className="backLink" href="#">
          ← Back to Search
        </a>

      </header>

      <main className="upcomingContent">
        <EventSection title="Going" events={going} onDetails={onDetails} />
        <EventSection title="Maybe" events={maybe} onDetails={onDetails} />
      </main>
    </div>
  );
};
