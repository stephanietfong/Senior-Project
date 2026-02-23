import { useParams } from "react-router-dom";

interface EventDetailsProps {
  title: string;
  image: string;
  host: string;
  location: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  description: string;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  title,
  image,
  host,
  location,
  startDate,
  endDate,
  description,
}) => {
  const { id } = useParams();

  return (
    <div className="py-4 px-20 text-black flex flex-col justify-center align-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <img src={image} alt="" />
      <ul>
        <li>Hosted by: {host}</li>
        <li>Starts at {startDate?.toLocaleString()}</li>
        <li>Ends at {endDate?.toLocaleString()}</li>
      </ul>
      <p>{description}</p>
      <div>
        <p>Location</p>
        <p>{location}</p>
      </div>
      <div>
        <p>Interested?</p>
        <div>
          <button>Yes</button>
          <button>Maybe</button>
        </div>
      </div>
    </div>
  );
};
