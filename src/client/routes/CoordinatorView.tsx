import React from "react";
import { PastEventCard, PastEvent } from "../components/PastEventCard";

// Reuse an image you already have, or swap these imports to your assets

export const CoordinatorViewPage = () => {
  const orgName = "University of Florida Swamphacks";
  const hostingSince = "01/01/2000";

  const pastEvents: PastEvent[] = [
    {
      id: 1,
      title: "Swamphacks XI",
      description: "— — — — — — — — — — — — — — — — —",
      daysAgoText: "22 days ago",
      likedText: "60 people liked this",
      tags: ["Tag 1", "Tag 2", "Tag 3"],
      imageSrc: "",
    },
    {
      id: 2,
      title: "Swamphacks X",
      description: "— — — — — — — — — — — — — — — — —",
      daysAgoText: "380 days ago",
      likedText: "60 people liked this",
      tags: ["Tag 1", "Tag 2", "Tag 3"],
      imageSrc: "",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 p-6">
      {/* white panel */}
      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-md bg-[#f7f1e6] shadow-lg">
        {/* Header strip */}
        <div className="border-b border-neutral-800 bg-[#f7f1e6] py-2 text-center text-lg font-medium text-neutral-900">
          Header
        </div>

        {/* back row */}
        <div className="flex items-center gap-3 border-b border-neutral-300 bg-[#f7f1e6] px-4 py-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-sm text-neutral-800 hover:underline"
          >
            ← Back to Event
          </button>
        </div>

        {/* org block */}
        <div className="bg-[#f7f1e6] px-6 py-5">
          <div className="flex items-center gap-4">
            {/* big circle "logo" */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-sky-500 bg-neutral-200 text-3xl font-semibold text-neutral-900">
              S
            </div>

            <div className="min-w-0">
              <div className="truncate text-lg font-semibold text-neutral-900">
                {orgName}
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-neutral-700">
                <span className="inline-block h-2 w-2 rotate-45 bg-sky-500" />
                <span>Hosting events since {hostingSince}</span>
              </div>
            </div>
          </div>

          {/* Past Events */}
          <h2 className="mt-6 text-lg font-semibold text-neutral-900">
            Past Events
          </h2>

          <div className="mt-3 flex flex-col gap-4 pb-6">
            {pastEvents.map((e) => (
              <PastEventCard
                key={e.id}
                event={e}
                onDetails={(id) => {
                  console.log("details for", id);
                  // later: navigate(`/events/${id}`) or open modal
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
