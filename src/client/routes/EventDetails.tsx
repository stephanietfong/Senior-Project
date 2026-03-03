import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEventById } from "@server/lib/events";
import backarrow from "@assets/backarrow.png";
import bluebullet from "@assets/bluebullet.png";
import greenbullet from "@assets/greenbullet.png";

const formatEventTimestamp = (timestamp?: string) => {
  if (!timestamp) return null;

  const parsedDate = new Date(timestamp);
  if (Number.isNaN(parsedDate.getTime())) return null;

  const datePart = parsedDate.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timePart = parsedDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} @ ${timePart}`;
};

export const EventDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>({});

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (id) {
          const event = await getEventById(id.toString());
          if (event) {
            setEvent(event);
            console.log(event);
          }
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  if (loading) {
    return <p>Loading ...</p>;
  }

  return (
    <div className="px-20 py-10 text-black flex flex-col justify-center items-center font-redhat gap-10">
      <a className="flex items-center self-start" href="/events">
        <img src={backarrow} alt="" />
        <span className="p-4 rounded-md font-semibold self-start">
          Back to Events
        </span>
      </a>
      <h1 className="text-5xl font-bold w-full text-center font-oswald mt-[-40px]">
        {event.title}
      </h1>
      <img
        src={event.image_url}
        alt={`Event: ${event.title}`}
        className="w-[36rem] h-auto shadow-lg"
      />
      <ul className="gap-2 flex flex-col">
        <li className="flex items-center gap-2">
          <img src={bluebullet} alt="" className="w-6 h-6" />
          <p className="text-lg">
            Hosted by:{" "}
            <span className="font-medium">
              {event.host ? event.host.display_name : "Unknown Host"}
            </span>
          </p>
        </li>
        <li className="flex items-center gap-2">
          <img src={greenbullet} alt="" className="w-6 h-6" />
          <p className="text-lg">
            Starts at{" "}
            <span className="font-medium">
              {formatEventTimestamp(event.start_time) ?? "Unknown Start Time"}
            </span>
          </p>
        </li>
        <li className="flex items-center gap-2">
          <img src={bluebullet} alt="" className="w-6 h-6" />
          <p className="text-lg">
            Ends at{" "}
            <span className="font-medium">
              {formatEventTimestamp(event.end_time) ?? "Unknown End Time"}
            </span>
          </p>
        </li>
      </ul>
      <p className="bg-customGray p-8 max-w-4xl">{event.summary}</p>
      <div className="flex flex-col items-center gap-4">
        <p className="text-3xl font-medium">Location</p>
        <p>{event.location_name}</p>
        <p>Note: I will link the image later -Stephanie</p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <p className="text-3xl font-medium">Interested in this Event?</p>
        <div className="flex gap-10">
          <button className="bg-customDarkBlue text-white p-4 rounded font-semibold min-w-24">
            Yes
          </button>
          <button className="bg-customGreen text-black p-4 rounded font-semibold min-w-24">
            Maybe
          </button>
        </div>
      </div>
    </div>
  );
};
