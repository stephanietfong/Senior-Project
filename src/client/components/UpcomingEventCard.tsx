import React from "react";

export type UpcomingEvent = {
  id: number;
  title: string;
  orgOrVenue: string;
  address: string;
  description: string;
  daysAwayText: string;
  imageSrc: string;
  onDetails?: () => void;
};

const ImageBox: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const hasSrc = Boolean(src && src.trim().length > 0);

  if (!hasSrc) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/5 rounded-xl border border-black/10">
        <span className="text-xs text-black/50">No Image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover rounded-xl border border-black/10"
    />
  );
};

export const UpcomingEventCard: React.FC<UpcomingEvent> = ({
  title,
  orgOrVenue,
  address,
  description,
  daysAwayText,
  imageSrc,
  onDetails,
}) => {
  return (
    <div className="grid grid-cols-[160px,1fr,180px] gap-6 p-5 bg-white text-black font-redhat rounded-2xl border border-black/10 shadow-sm">
      <div className="w-full h-[120px]">
        <ImageBox src={imageSrc} alt={title} />
      </div>

      <div className="flex flex-col gap-3 min-w-0">
        <div className="min-w-0">
          <p className="font-oswald text-3xl leading-tight truncate">{title}</p>
          <p className="italic text-sm text-black/70">{orgOrVenue}</p>
          <p className="text-sm text-black/70">{address}</p>
        </div>

        <p className="text-sm text-black/80 line-clamp-2">{description}</p>
      </div>

      <div className="flex flex-col justify-between items-end">
        <p className="text-sm text-black/70">{daysAwayText}</p>
        <button
          onClick={onDetails}
          className="rounded-full px-5 py-2 bg-customGreen font-semibold hover:opacity-90"
        >
          Details
        </button>
      </div>
    </div>
  );
};