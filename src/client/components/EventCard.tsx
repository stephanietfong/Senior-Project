import { Link } from "react-router-dom";

type Tag = {
  tag_id: number;
  tag_name: string;
};

interface EventCardProps {
  id: number;
  name: string;
  image: string;
  location: string;
  date: Date;
  description: string;
  tags?: { tags: Tag }[];
  hostId?: string;
  hostName?: string;
}

function calculateDate(date: Date) {
  const today = new Date();
  const event = new Date(date);

  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const targetMidnight = new Date(
    event.getFullYear(),
    event.getMonth(),
    event.getDate(),
  );

  const diff = Math.floor(
    (targetMidnight.getTime() - todayMidnight.getTime()) / (24 * 3600 * 1000),
  );

  if (diff == 0) {
    return "In 0 days";
  }
  return `In ${diff} days`;
}

const TagIcon: React.FC<{ tag: string }> = ({ tag }) => {
  return <div className="p-2 rounded-full bg-customBlue text-sm">{tag}</div>;
};

export const EventCard: React.FC<EventCardProps> = ({
  id,
  name,
  image,
  location,
  date,
  description,
  tags,
  hostId,
  hostName,
}) => {
  return (
    <div className="grid grid-cols-[1fr,3fr,0.5fr] gap-4 p-4 bg-customGray text-black font-redhat rounded-md">
      <div className="w-full h-full flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt="Event"
            className="w-full h-full max-w-64 max-h-72 rounded-md object-cover"
          />
        ) : (
          <div className="w-full h-full max-w-64 max-h-72 rounded-md flex items-center justify-center bg-gray-200 text-gray-600 text-sm text-center p-2">
            No Image Available
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-oswald text-3xl">{name.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')}</p>
          <p className="italic">{location?.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')}</p>
          {hostId && hostName && (
            <p className="text-sm text-black/50">Hosted by {hostName}</p>
          )}
        </div>
        <p className="word-wrap text-sm">{description.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')}</p>
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag) => (
            <TagIcon key={tag.tags.tag_id} tag={tag.tags.tag_name} />
          ))}
        </div>
      </div>
      <div className="flex flex-col h-full justify-between">
        <p className="text-right text-sm">{calculateDate(date)}</p>
        <div className="flex flex-col gap-2">
          {hostId && hostName && (
            <Link
              to={`/coordinator/${hostId}`}
              className="rounded-full p-2 bg-customDarkBlue font-semibold text-center text-sm"
            >
              Host Profile
            </Link>
          )}
          <Link
            to={`/events/${id}`}
            className="rounded-full p-2 bg-customGreen font-semibold text-center"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};
