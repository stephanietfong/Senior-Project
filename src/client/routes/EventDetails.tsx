import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEventById } from "../../server/lib/events";

export const EventDetails = () => {
  const { id } = useParams();
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
      }
    };
    fetchEventDetails();
  }, [id]);

  return (
    <div className="py-4 px-20 text-black flex flex-col justify-center align-center">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <img src={event.image_url} alt="" />
      <ul>
        <li>
          Hosted by: {event.host ? event.host.display_name : "Unknown Host"}
        </li>
        <li>Starts at {event.start_time?.toLocaleString()}</li>
        <li>Ends at {event.end_time?.toLocaleString()}</li>
      </ul>
      <p>{event.description}</p>
      <div>
        <p>Location</p>
        <p>{event.location_name}</p>
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
