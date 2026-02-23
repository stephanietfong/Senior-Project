type UpcomingEvent = {
  id: number;
  title: string;
  orgOrVenue: string;
  address: string;
  description: string;
  daysAwayText: string;
  imageSrc: string;
  onDetails?: () => void;
};

export function UpcomingEventCard({
  title,
  orgOrVenue,
  address,
  description,
  daysAwayText,
  imageSrc,
  onDetails,
}: UpcomingEvent) {
  return (
    <div className="flex gap-4 rounded-md bg-[#d9d9d9] p-3 shadow-sm">
      <img
        src={imageSrc}
        alt={title}
        className="h-24 w-24 flex-shrink-0 rounded-sm object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-[Oswald] text-xl text-black">{title}</h3>
            <p className="text-sm text-black/80">{orgOrVenue}</p>
            <p className="text-sm text-black/80">{address}</p>
          </div>

          <p className="whitespace-nowrap text-xs text-black/70">{daysAwayText}</p>
        </div>

        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="line-clamp-2 text-sm text-black/80">{description}</p>

          <button
            onClick={onDetails}
            className="rounded-full bg-[#bac67a] px-4 py-1 text-sm font-medium text-black shadow-sm hover:opacity-90"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
