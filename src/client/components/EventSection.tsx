import { UpcomingEventCard } from "./UpcomingEventCard";

type UpcomingEvent = Parameters<typeof UpcomingEventCard>[0];

export function EventSection({
  title,
  events,
}: {
  title: string;
  events: UpcomingEvent[];
}) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-center font-[Oswald] text-2xl text-black">
        {title}
      </h2>

      <div className="space-y-3">
        {events.map((e) => (
          <UpcomingEventCard key={e.id} {...e} />
        ))}
      </div>
    </section>
  );
}
