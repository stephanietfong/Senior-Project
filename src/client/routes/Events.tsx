import { useState, useEffect } from "react";
import { EventCard } from "@components/EventCard";
import { Filters } from "@components/Filters";
import { getAllEvents } from "@lib/events";
import { getAllTags } from "@lib/tags";
import { getUserInterests } from "@lib/interests";
import { getCurrentUser } from "@lib/users";

export const EventsPage = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 15;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [fetchedEvents, fetchedTags] = await Promise.all([
          getAllEvents(),
          getAllTags(),
        ]);

        const allEvents = fetchedEvents ?? [];
        setTags(fetchedTags ?? []);

        const user = await getCurrentUser();
        if (user) {
          const interests = await getUserInterests(user.id);
          const interestTagIds = new Set(interests.map((t: any) => t.tag_id));
          const sorted = [...allEvents].sort((a, b) => {
            const aMatches = a.event_tags?.some((et: any) =>
              interestTagIds.has(et.tags?.tag_id),
            );
            const bMatches = b.event_tags?.some((et: any) =>
              interestTagIds.has(et.tags?.tag_id),
            );
            if (aMatches && !bMatches) return -1;
            if (!aMatches && bMatches) return 1;
            return 0;
          });
          setEvents(sorted);
          setDisplayedEvents(sorted);
        } else {
          setEvents(allEvents);
          setDisplayedEvents(allEvents);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchAll();
  }, []);

  function handleSearch(): void {
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
    setCurrentPage(1);
  }

  function clearSearch(): void {
    setSearchTerm("");
    setSearchTags([]);
    setDisplayedEvents(events);
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(displayedEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = displayedEvents.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE,
  );

  if (loading) {
    return <p>Loading ...</p>;
  }

  return (
    <div className="py-10 px-20 text-black">
      <div className="mb-10 flex flex-row justify-between">
        <input
          type="text"
          placeholder="Search by Event Name"
          className="rounded-full py-2 px-4 bg-customDarkBlue placeholder:text-gray-900 w-1/2 focus:outline-none focus:ring-0 focus:border-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="list-none cursor-pointer bg-customDarkBlue py-2 px-4 rounded-md select-none font-semibold"
          onClick={() => setIsFiltersOpen(true)}
        >
          Filter Search
        </button>
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

      {isFiltersOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setIsFiltersOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Filters>
              <button
                className="mt-4 rounded-md bg-customDarkBlue px-4 py-2 font-semibold"
                onClick={() => setIsFiltersOpen(false)}
              >
                Close
              </button>
            </Filters>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-10">
        {paginatedEvents.map((e) => (
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

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            &larr;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded ${
                page === currentPage
                  ? "bg-customGreen text-white"
                  : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
