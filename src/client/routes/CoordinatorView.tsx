import React from "react";
import { PastEventCard, PastEvent } from "../components/PastEventCard";

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
    <div className="py-4 px-20 text-black">
      {/* Top row */}
      <div className="my-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-customDarkBlue py-2 px-4 font-semibold hover:opacity-90"
        >
          ← Back
        </button>

        <div className="flex items-center gap-3">
          <button className="bg-customGreen py-2 font-semibold px-4 hover:opacity-90">
            Create Event +
          </button>
          <button className="bg-customDarkBlue py-2 px-4 font-semibold hover:opacity-90">
            Manage
          </button>
        </div>
      </div>

      {/* Centered content like a real dashboard */}
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-8">
        {/* Org header card */}
        <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6 font-redhat">
          <div className="flex items-center gap-5">
            {/* org "logo" */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-customBlue bg-black/5 text-3xl font-semibold">
              S
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-oswald text-4xl leading-tight truncate">
                {orgName}
              </p>
              <p className="mt-1 text-sm text-black/60 italic">
                Hosting events since {hostingSince}
              </p>
            </div>
          </div>
        </div>

        {/* Past events section */}
        <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <p className="font-oswald text-3xl">Past Events</p>

            {/* optional: right-side action */}
            <button className="bg-customDarkBlue py-2 px-4 font-semibold hover:opacity-90">
              View Analytics
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-6">
            {pastEvents.map((e) => (
              <PastEventCard
                key={e.id}
                event={e}
                onDetails={(id) => console.log("details for", id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};