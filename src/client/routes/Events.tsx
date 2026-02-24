import { useState, useEffect } from "react";
import { EventCard } from "../components/EventCard";
import { getAllEvents } from "../../server/lib/events";

const Tags = ["Academic", "Club", "Music", "18+", "21+", "Sport", "Outside"];

export const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const data = await getAllEvents();

        setEvents(data ?? []);
        setDisplayedEvents(data ?? []);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchAllEvents();
  }, []);

  function handleClick(): void {
    const newEvents = events.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase()),
    );
    setDisplayedEvents(newEvents);
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
        {displayedEvents.map((e) => (
          <EventCard
            key={e.id}
            id={e.id}
            name={e.title}
            image={e.image_url}
            location={e.location_name}
            date={e.start_time}
            description={e.summary}
          />
        ))}
      </div>
    </div>
  );
};
