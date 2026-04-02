import React, { useEffect, useState } from "react";
import { Settings } from "@components/Settings";
import { Link, useNavigate } from "react-router-dom";
import { getAllTags } from "@lib/tags";
import { createEvent, addTagToEvent } from "@lib/events";
import { getCurrentUser } from "@lib/users";
import { supabase } from "../supabaseClient";


export const CreateEventPage = () => {
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [capacity, setCapacity] = useState("");
  const [is18Plus, setIs18Plus] = useState(false);
  const [is21Plus, setIs21Plus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllTags().then((result) => setTags(result));
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await getCurrentUser();
      if (!user) {
        alert("You must be logged in to create an event");
        return;
      }

      let imageUrl = "";
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('Event Images')
          .upload(fileName, imageFile);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage
          .from('Event Images')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const eventData = {
        host_id: user.id,
        title,
        summary: description || summary,
        location_name: locationName,
        address,
        image_url: imageUrl,
        capacity: capacity ? Number(capacity) : undefined,
        is_18_plus: is18Plus,
        is_21_plus: is21Plus,
        start_time: startTime,
        end_time: endTime,
      };
      const newEvent = await createEvent(eventData);
      for (const tagId of selectedTags) {
        await addTagToEvent(newEvent.event_id, tagId.toString());
      }
      navigate(`/events/${newEvent.event_id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event");
    }
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };
  const styles = `
    .create-event-page {
      color: black;
      font-family: Sans-Serif;
    }

    .create-event-page h1 {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-top: 40px;
    }

    .create-event-page h2 {
      font-size: 18px;
    }
    `;
  return (
    <>
      <style>{styles}</style>
      <div className="create-event-page">
        {/* <Link to="/"><button>Back</button></Link> */}
        <form onSubmit={handleSubmit} style={{ padding: 20 }}>
          <h1 style={{ marginTop: 0 }}>Basic Info</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 20,
            }}
          >
            <h2>Event Title</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                backgroundColor: "lightgray",
                borderRadius: "5px",
                width: "40%",
              }}
            />
            <h2>Event Summary</h2>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={{
                backgroundColor: "lightgray",
                borderRadius: "5px",
                width: "40%",
                height: 100,
              }}
            />
            <h2>Tags</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {tags.map((tag) => (
                <button
                  key={tag.tag_id}
                  type="button"
                  onClick={() => toggleTag(tag.tag_id)}
                  style={{
                    border: selectedTags.includes(tag.tag_id)
                      ? "2px solid #7793C2"
                      : "1.5px solid black",
                    borderRadius: "5px",
                    padding: "10px 30px",
                    backgroundColor: selectedTags.includes(tag.tag_id)
                      ? "#7793C2"
                      : "white",
                  }}
                >
                  {tag.tag_name}
                </button>
              ))}
            </div>
          </div>
          <h1>Date & Time</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <div>
              <p
                style={{
                  textAlign: "center",
                  marginBottom: "5px",
                }}
              >
                Start Time
              </p>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                style={{
                  backgroundColor: "lightgray",
                  borderRadius: "5px",
                  padding: "5px",
                }}
              />
            </div>
            <div>
              <p
                style={{
                  textAlign: "center",
                  marginBottom: "5px",
                }}
              >
                End Time
              </p>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                style={{
                  backgroundColor: "lightgray",
                  borderRadius: "5px",
                  padding: "5px",
                }}
              />
            </div>
          </div>
          <div>
            <h1>Location</h1>
            <h2>Location Name</h2>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              style={{
                backgroundColor: "lightgray",
                borderRadius: "5px",
                width: "40%",
                margin: "10px 0",
              }}
            />
            <h2>Location Address</h2>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                backgroundColor: "lightgray",
                borderRadius: "5px",
                width: "40%",
                marginTop: 10,
              }}
            />
            <h1>Details</h1>
            <h2>Description</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                backgroundColor: "lightgray",
                borderRadius: "5px",
                width: "40%",
                height: 100,
              }}
            />
            <h2 style={{ margin: "10px 0" }}>Event Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            <h2 style={{ margin: "10px 0" }}>Requires RSVP/Ticket</h2>
            <input type="checkbox" style={{ backgroundColor: "white" }}></input>
            <h2>Capacity</h2>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              style={{
                backgroundColor: "lightgray",
                borderRadius: "5px",
                width: "40%",
                marginTop: 10,
              }}
            />
            <h2 style={{ margin: "10px 0" }}>Is 18+</h2>
            <input
              type="checkbox"
              checked={is18Plus}
              onChange={(e) => setIs18Plus(e.target.checked)}
            />
            <h2 style={{ margin: "10px 0" }}>Is 21+</h2>
            <input
              type="checkbox"
              checked={is21Plus}
              onChange={(e) => setIs21Plus(e.target.checked)}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/events")}
              style={{
                backgroundColor: "#BAC67A",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: "#7793C2",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
