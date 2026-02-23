import { EventSection } from "../components/EventSection";

// will replace these w/ real assets 
const SwamphacksImg = "";
const RopinImg = "";
const CountryImg = "";

export function UpcomingEventsPage() {
  const going = [
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

  const maybe = [
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

  return (
    <div className="min-h-screen bg-[#f6f0e6] text-black">
      {/*headerr */}
      <div className="sticky top-0 z-10 border-b-2 border-black bg-[#f6f0e6] px-4 py-3">
        <h1 className="text-center font-[Oswald] text-3xl">Upcoming Events</h1>
      </div>

      {/*subheader row */}
      <div className="flex items-center justify-between px-4 py-3">
        <button className="flex items-center gap-2 text-black/80 hover:text-black">
          <span className="text-xl">←</span>
          <span className="text-sm">Back to Search</span>
        </button>
      </div>

      {/* content*/}
      <div className="mx-auto w-full max-w-[420px] px-4 pb-10">
        <EventSection title="Going" events={going} />
        <EventSection title="Maybe" events={maybe} />
      </div>
    </div>
  );
}
