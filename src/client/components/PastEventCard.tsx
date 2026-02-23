import React from "react";

export type PastEvent = {
  id: number | string;
  title: string;
  description: string;
  daysAgoText: string;
  likedText: string;
  tags: string[];
  imageSrc: string;
};

type Props = {
  event: PastEvent;
  onDetails?: (id: PastEvent["id"]) => void;
};

export const PastEventCard: React.FC<Props> = ({ event, onDetails }) => {
  return (
    <div className="flex gap-4 rounded-lg bg-neutral-200/90 p-4 shadow-sm">
      {}
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-neutral-300">
        <img
          src={event.imageSrc}
          alt={event.title}
          className="h-full w-full object-cover"
        />
      </div>

      {}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate text-xl font-semibold text-neutral-900">
            {event.title}
          </h3>
          <span className="flex-shrink-0 text-sm text-neutral-600">
            {event.daysAgoText}
          </span>
        </div>

        <p className="text-sm text-neutral-700">
          <span className="font-medium text-neutral-800">Short Description</span>{" "}
          {event.description}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {event.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-neutral-300 px-2 py-0.5 text-xs text-neutral-800"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm text-neutral-700">{event.likedText}</span>

          <button
            type="button"
            onClick={() => onDetails?.(event.id)}
            className="rounded-full bg-lime-300 px-4 py-1 text-sm font-medium text-neutral-900 shadow-sm hover:bg-lime-200"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
