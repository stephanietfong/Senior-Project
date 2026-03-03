import { useState, useEffect } from "react";
import { EventCard } from "../components/EventCard";
import { getAllEvents } from "../../server/lib/events";
import { getAllTags } from "../../server/lib/tags";

export const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTags, setSearchTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const events = await getAllEvents();

        setEvents(events ?? []);
        setDisplayedEvents(events ?? []);
        console.log(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const fetchAllTags = async () => {
      try {
        const tags = await getAllTags();

        setTags(tags ?? []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchAllEvents();
    fetchAllTags();
  }, []);

  function handleSearch(): void {
    // Search by event title or summary, and filter by selected tags
    const newEvents = events.filter(
      (e) =>
        (e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.summary.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (searchTags.length === 0 ||
          e.event_tags.some((tagObj: any) =>
            searchTags.includes(tagObj.tags.tag_name),
          )),
    );

    setDisplayedEvents(newEvents);
  }

  function clearSearch(): void {
    setSearchTerm("");
    setSearchTags([]);
    setDisplayedEvents(events);
  }

  function toggleSearchTag(tagName: string): void {
    setSearchTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((tag) => tag !== tagName)
        : [...prev, tagName],
    );
  }

  return (
    <div className="py-4 px-20 text-black">
      <div className="my-10 flex flex-row justify-between">
        <input
          type="text"
          placeholder="Search by Event Name"
          className="rounded-full py-2 px-4 bg-customDarkBlue placeholder:text-gray-900 w-1/2 focus:outline-none focus:ring-0 focus:border-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <details className="relative">
          <summary className="list-none cursor-pointer bg-customDarkBlue py-2 px-4 rounded-md select-none">
            Search by Tags
          </summary>
          <div className="absolute right-0 mt-2 w-56 max-h-64 overflow-y-auto bg-customGray p-3 rounded-md shadow-md z-10">
            {tags.map((tag) => (
              <label
                key={tag.tag_id}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={searchTags.includes(tag.tag_name)}
                  onChange={() => toggleSearchTag(tag.tag_name)}
                />
                <span>{tag.tag_name}</span>
              </label>
            ))}
          </div>
        </details>

        <button
          className="bg-customBrown py-2 px-4 font-semibold rounded-md"
          onClick={clearSearch}
        >
          Clear Search
        </button>
        <button
          className="bg-customGreen py-2 font-semibold px-10 rounded-md"
          onClick={handleSearch}
        >
          Search Events
        </button>
      </div>

      <div className="flex flex-col gap-10">
        {displayedEvents.map((e) => (
          <EventCard
            key={e.event_id}
            id={e.event_id}
            name={e.title}
            image={e.image_url}
            location={e.location_name}
            date={e.start_time}
            description={e.summary}
            tags={e.event_tags}
          />
        ))}
      </div>
    </div>
  );
};
