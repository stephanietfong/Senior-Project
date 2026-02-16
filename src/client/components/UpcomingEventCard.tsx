import React from "react";

export type UpcomingEvent = {
  id: string;
  title: string;
  locationLine1: string;
  locationLine2: string;
  description: string;
  startsInText: string;
  imageUrl: string;
};

type Props = {
  event: UpcomingEvent;
  onDetails?: (eventId: string) => void;
};

export const UpcomingEventCard: React.FC<Props> = ({ event, onDetails }) => {
  return (
    <div className="eventCard">
      <img className="eventImage" src={event.imageUrl} alt={event.title} />

      <div className="eventBody">
        <div className="eventTopRow">
          <h3 className="eventTitle">{event.title}</h3>
          <div className="eventWhen">{event.startsInText}</div>
        </div>

        <div className="eventLocation">
          <div className="eventLocLine">{event.locationLine1}</div>
          <div className="eventLocLine">{event.locationLine2}</div>
        </div>

        <p className="eventDesc">{event.description}</p>
      </div>

      <div className="eventActions">
        <button
          className="detailsBtn"
          onClick={() => onDetails?.(event.id)}
          type="button"
        >
          Details
        </button>
      </div>
    </div>
  );
};
