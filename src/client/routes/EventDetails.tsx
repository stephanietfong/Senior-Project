import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEventById } from "@server/lib/events";
import backarrow from "@assets/backarrow.png";
import bluebullet from "@assets/bluebullet.png";
import greenbullet from "@assets/greenbullet.png";
import { getCurrentUser } from "@/server/lib/users";
import {
  createOrUpdateRSVP,
  checkRSVPForSingleUserAndEvent,
} from "@/server/lib/rsvps";

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [interested, setInterested] = useState(false);

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

    const fetchCurrentUserAndInterest = async () => {
      try {
        let u = await getCurrentUser();
        setUser(u);

        if (u && id) {
          let i = await checkRSVPForSingleUserAndEvent(
            u.id.toString(),
            id.toString(),
          );
          setInterested(i);
        }
      } catch (error) {
        console.error("Error fetching current user and interest:", error);
      }
    };
    fetchEventDetails();
    fetchCurrentUserAndInterest();
  }, [id]);

  const handleInterest = async () => {
    try {
      if (id) {
        const data = await createOrUpdateRSVP(
          user.id.toString(),
          id.toString(),
        );
      }
    } catch (error) {
      console.error("Error creating RSVP:", error);
    }
  };

  if (loading) {
    return <p>Loading ...</p>;
  }

  return (
    <div className="px-20 py-10 text-black flex flex-col justify-center items-center font-redhat gap-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center self-start bg-transparent border-none cursor-pointer"
      >
        <img src={backarrow} alt="" />
        <span className="p-4 rounded-md font-semibold">Back</span>
      </button>
      <h1 className="text-5xl font-bold w-full text-center font-oswald mt-[-40px]">
        {event.title}
      </h1>
      <div className="flex flex-row gap-10 items-center justify-center">
        <img
          src={event.image_url}
          alt={`Event: ${event.title}`}
          className="w-[36rem] h-auto shadow-lg"
        />
        <div className="flex flex-col p-4 gap-4">
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
                Occurs between{" "}
                <span className="font-medium">
                  {formatEventTimestamp(event.start_time) ??
                    "Unknown Start Time"}
                </span>{" "}
                and{" "}
                <span className="font-medium">
                  {formatEventTimestamp(event.end_time) ?? "Unknown End Time"}
                </span>
              </p>
            </li>
          </ul>
          <p className="bg-customGray p-8 max-w-4xl">{event.summary}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-3xl font-medium">Location</p>
        <p>{event.location_name}</p>
        <p>Note: I will link the image later -Stephanie</p>
      </div>

      {interested ? (
        <button
          className="bg-customGreen text-white p-4 rounded font-semibold min-w-24"
          disabled={true}
        >
          You've marked your interest in this event
        </button>
      ) : (
        <button
          className="bg-customDarkBlue text-white p-4 rounded font-semibold min-w-24"
          onClick={() => handleInterest()}
        >
          Mark this event as Interested
        </button>
      )}
    </div>
  );
};
