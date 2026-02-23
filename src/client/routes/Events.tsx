import { useState } from "react";
import { EventCard } from "../components/EventCard";
import CountryLineDancing from "../assets/CountryLineDancing.png";
import Swamphacks from "../assets/Swamphacks.png";
import Ropin from "../assets/Ropin.png";

const SampleEvents: {
  id: number;
  title: string;
  image: string;
  location: string;
  description: string;
  date: Date;
  tags: string[];
}[] = [
  {
    id: 1,
    title: "Swamphacks",
    image: Swamphacks,
    location: "University of Florida",
    description:
      "SwampHacks is the University of Florida’s flagship student-run hackathon — a 36-hour innovation sprint where college students from UF and around the country team up to learn new skills, build projects, and network with peers, mentors, and tech sponsors. It’s free to attend, open to all majors and experience levels, and includes workshops, mentorship, coding, and community events designed to help participants bring creative ideas to life.",
    date: new Date(),
    tags: ["Academic"],
  },
  {
    id: 2,
    title: "Ropin in the Swamp",
    image: Ropin,
    location: "1934 SW 63rd Ave, Gainesville, FL",
    description:
      "Ropin’ in the Swamp is an annual western-themed event held at the University of Florida’s Horse Teaching Unit where participants compete in team roping and other rodeo-style activities, often featuring family-friendly games, demonstrations, and a festive atmosphere celebrating horsemanship.",
    date: new Date(2026, 12, 25, 10, 0, 0, 0),
    tags: ["Sport", "Outside"],
  },
  {
    id: 3,
    title: "Country Line Dancing",
    image: CountryLineDancing,
    location: "Vivid Music Hall",
    description:
      "Vivid Music Hall in downtown Gainesville hosts country line dancing nights where people gather on the dance floor to groove to upbeat country music and learn or show off synchronized line dance moves. It’s a lively, social evening with a fun, energetic atmosphere open to dancers of all experience levels.",
    date: new Date(2026, 11, 25, 10, 0, 0, 0),
    tags: ["Club", "Music", "18+"],
  },
];

const Tags = ["Academic", "Club", "Music", "18+", "21+", "Sport", "Outside"];

export const EventsPage = () => {
  const [events, setEvents] = useState(SampleEvents);
  const [search, setSearch] = useState("");

  function handleClick(): void {
    const newEvents = SampleEvents.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase()),
    );
    setEvents(newEvents);
  }

  return (
    <div className="py-4 px-20 text-black">
      <div className="my-10 flex flex-row justify-between">
        <input
          type="text"
          placeholder="Search by Event Name"
          className="rounded-full p-2 bg-customDarkBlue placeholder:text-gray-900 w-1/2 focus:outline-none focus:ring-0 focus:border-none"
          onChange={(e) => setSearch(e.target.value)}
        />
        <input type="checkbox" />
        <button
          className="bg-customGreen py-2 font-semibold px-4"
          onClick={handleClick}
        >
          Search
        </button>
        <button className="bg-customDarkBlue py-2 px-4 font-semibold">
          Add Event +
        </button>
      </div>
      <div className="flex flex-col gap-10">
        {events
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map((e) => (
            <EventCard
              key={e.id}
              id={e.id}
              name={e.title}
              image={e.image}
              location={e.location}
              date={e.date}
              description={e.description}
              tags={e.tags}
            />
          ))}
      </div>
    </div>
  );
};
