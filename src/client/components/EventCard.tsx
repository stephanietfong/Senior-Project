interface EventCardProps {
  id: number;
  name: string;
  image: string;
  location: string;
  date: Date;
  description: string;
  tags: string[];
}

function calculateDate(date: Date) {
  const today = new Date();
  const diff = Math.floor(
    (date.getTime() - today.getTime()) / (24 * 3600 * 1000),
  );

  if (today.getDate() === date.getDate()) {
    return "In 0 days";
  }
  return `In ${diff} days`;
}

const TagIcon: React.FC<{ tag: string }> = ({ tag }) => {
  return <div className="p-2 rounded-full bg-customBlue">{tag}</div>;
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
    <div className="grid grid-cols-[1fr,3fr,0.5fr] gap-4 p-4 bg-customGray text-black font-redhat">
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={image}
          alt="Image"
          className="w-full h-full max-w-64 max-h-72"
        />
      </div>

      <div className="flex flex-col gap-2 justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-oswald text-3xl">{name}</p>
          <p className="italic">{location}</p>
        </div>
        <p className="word-wrap text-sm">{description}</p>
        <div className="flex gap-2 text-xs">
          {tags.map((tag, index) => (
            <TagIcon key={index} tag={tag} />
          ))}
        </div>
      </div>
      <div className="flex flex-col h-full justify-between">
        <p className="text-right text-sm">{calculateDate(date)}</p>
        <button className="rounded-full p-2 bg-customGreen font-semibold">
          Details
        </button>
      </div>
    </div>
  );
};
