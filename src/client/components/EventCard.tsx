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
  tags: { tags: Tag }[];
}

function calculateDate(date: Date) {
  const today = new Date();
  const diff = Math.floor(
    (new Date(date).getTime() - today.getTime()) / (24 * 3600 * 1000),
  );

  if (today.getDate() === new Date(date).getDate()) {
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
}) => {
  return (
    <div className="grid grid-cols-[1fr,3fr,0.5fr] gap-4 p-4 bg-customGray text-black font-redhat rounded-md">
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={image}
          alt="Image"
          className="w-full h-full max-w-64 max-h-72 rounded-md"
        />
      </div>

      <div className="flex flex-col gap-2 justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-oswald text-3xl">{name}</p>
          <p className="italic">{location}</p>
        </div>
        <p className="word-wrap text-sm">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagIcon key={tag.tags.tag_id} tag={tag.tags.tag_name} />
          ))}
        </div>
      </div>
      <div className="flex flex-col h-full justify-between">
        <p className="text-right text-sm">{calculateDate(date)}</p>
        <Link
          to={`/events/${id}`}
          className="rounded-full p-2 bg-customGreen font-semibold text-center"
        >
          Details
        </Link>
      </div>
    </div>
  );
};
