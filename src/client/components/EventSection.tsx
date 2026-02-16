import React from "react";
import { UpcomingEvent, UpcomingEventCard } from "./UpcomingEventCard";

type Props = {
  title: string;
  events: UpcomingEvent[];
  onDetails?: (eventId: string) => void;
};

export const EventSection: React.FC<Props> = ({ title, events, onDetails }) => {
  if (events.length === 0) return null;

  return (
    <section className="eventSection">
      <h2 className="sectionTitle">{title}</h2>

      <div className="eventList">
        {events.map((e) => (
          <UpcomingEventCard key={e.id} event={e} onDetails={onDetails} />
        ))}
      </div>
    </section>
  );
};
