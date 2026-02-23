import React from "react";

export type PastEvent = {
  id: number | string;
  title: string;
  description: string;
  daysAgoText: string;
  likedText: string;
  tags: string[];
  imageSrc: string;
};

type Props = {
  event: PastEvent;
  onDetails?: (id: PastEvent["id"]) => void;
};

const TagPill: React.FC<{ tag: string }> = ({ tag }) => {
  return (
    <span className="rounded-full bg-customBlue/80 px-3 py-1 text-xs">
      {tag}
    </span>
  );
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

export const PastEventCard: React.FC<Props> = ({ event, onDetails }) => {
  return (
    <div className="grid grid-cols-[160px,1fr,180px] gap-6 p-5 bg-white text-black font-redhat rounded-2xl border border-black/10 shadow-sm">
      {/* Image */}
      <div className="w-full h-[120px]">
        <ImageBox src={event.imageSrc} alt={event.title} />
      </div>

      {/* Main */}
      <div className="flex flex-col gap-3 min-w-0">
        <div className="min-w-0">
          <p className="font-oswald text-3xl leading-tight truncate">
            {event.title}
          </p>
          <p className="text-sm text-black/60 italic">{event.daysAgoText}</p>
        </div>

        <p className="text-sm text-black/80 line-clamp-2">
          {event.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col justify-between items-end">
        <p className="text-sm text-black/70 text-right">{event.likedText}</p>

        <button
          type="button"
          onClick={() => onDetails?.(event.id)}
          className="rounded-full px-5 py-2 bg-customGreen font-semibold hover:opacity-90"
        >
          Details
        </button>
      </div>
    </div>
  );
};