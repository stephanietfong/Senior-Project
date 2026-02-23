import { useState } from "react";
import { UpcomingEventCard, UpcomingEvent } from "../components/UpcomingEventCard";

// will replace these w/ real assets
const SwamphacksImg = "";
const RopinImg = "";
const CountryImg = "";

export function UpcomingEventsPage() {
  const [search, setSearch] = useState("");

  const going: UpcomingEvent[] = [
    {
      id: 1,
      title: "Swamphacks",
      orgOrVenue: "University of Florida",
      address: "Gainesville, FL",
      description: "UF’s flagship student hackathon with workshops and prizes.",
      daysAwayText: "In 6 days",
      imageSrc: SwamphacksImg,
      onDetails: () => alert("TODO: Details page"),
    },
    {
      id: 2,
      title: "Ropin in the Swamp",
      orgOrVenue: "Rodeo Grounds",
      address: "1934 SW 63rd Ave, Gainesville, FL",
      description: "Annual western-themed event with food, games, and live shows.",
      daysAwayText: "In 9 days",
      imageSrc: RopinImg,
      onDetails: () => alert("TODO: Details page"),
    },
  ];

  const maybe: UpcomingEvent[] = [
    {
      id: 3,
      title: "Country Line Dancing",
      orgOrVenue: "Vivid Music Hall",
      address: "Downtown Gainesville",
      description: "Beginner-friendly lesson + open dance floor after.",
      daysAwayText: "In 8 days",
      imageSrc: CountryImg,
      onDetails: () => alert("TODO: Details page"),
    },
  ];

  const matches = (e: UpcomingEvent) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      e.title.toLowerCase().includes(q) ||
      e.orgOrVenue.toLowerCase().includes(q) ||
      e.address.toLowerCase().includes(q)
    );
  };

  const goingFiltered = going.filter(matches);
  const maybeFiltered = maybe.filter(matches);

  return (
    <div className="py-4 px-20 text-black">
      <div className="my-10 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search Upcoming Events"
          className="rounded-full p-2 bg-customDarkBlue placeholder:text-gray-900 w-1/2 focus:outline-none focus:ring-0 focus:border-none"
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="bg-customDarkBlue py-2 px-4 font-semibold hover:opacity-90"
          onClick={() => window.history.back()}
        >
          ← Back to Search
        </button>
      </div>

      <div className="mx-auto w-full max-w-6xl flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <p className="font-oswald text-4xl">Going</p>
          <div className="flex flex-col gap-6">
            {goingFiltered.map((e) => (
              <UpcomingEventCard key={e.id} {...e} />
            ))}
            {goingFiltered.length === 0 && (
              <p className="text-sm text-black/60">No matches in Going.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <p className="font-oswald text-4xl">Maybe</p>
          <div className="flex flex-col gap-6">
            {maybeFiltered.map((e) => (
              <UpcomingEventCard key={e.id} {...e} />
            ))}
            {maybeFiltered.length === 0 && (
              <p className="text-sm text-black/60">No matches in Maybe.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}