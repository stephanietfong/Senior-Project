import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllTags } from "@lib/tags";
import { getEventById, updateEvent, removeAllTagsFromEvent, addTagToEvent } from "@lib/events";
import { getCurrentUser } from "@lib/users";
import { getRSVPsForEvent } from "@/server/lib/rsvps";
import { supabase } from "../supabaseClient";

export const EditEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [capacity, setCapacity] = useState("");
  const [is18Plus, setIs18Plus] = useState(false);
  const [is21Plus, setIs21Plus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const [allTags, event] = await Promise.all([getAllTags(), getEventById(id)]);
      setTags(allTags);

      setTitle(event.title || "");
      setSummary(event.summary || "");
      setDescription(event.summary || "");
      setLocationName(event.location_name || "");
      setAddress(event.address || "");
      setExistingImageUrl(event.image_url || "");
      setCapacity(event.capacity ? String(event.capacity) : "");
      setIs18Plus(event.is_18_plus || false);
      setIs21Plus(event.is_21_plus || false);

      // Format datetime-local strings (YYYY-MM-DDTHH:MM)
      if (event.start_time) {
        setStartTime(event.start_time.slice(0, 16));
      }
      if (event.end_time) {
        setEndTime(event.end_time.slice(0, 16));
      }

      // Pre-select existing tags
      const existingTagIds: number[] = (event.event_tags || [])
        .map((et: any) => et?.tags?.tag_id)
        .filter(Boolean);
      setSelectedTags(existingTagIds);

      setLoading(false);
    };
    load();
  }, [id]);

  const sendNotifications = async (eventTitle: string) => {
    if (!id) return;
    try {
      const rsvps = await getRSVPsForEvent(id);
      const emails: string[] = (rsvps || [])
        .map((r: any) => r.user?.email)
        .filter(Boolean);

      await Promise.all(
        emails.map((email) =>
          fetch("http://localhost:5000/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: email,
              subject: `Event Updated: ${eventTitle}`,
              text: `The event "${eventTitle}" you RSVPed to has been updated. Please check the event details for the latest information. Update your digital calendar if necessary!`,
            }),
          })
        )
      );
    } catch (err) {
      console.error("Failed to send update notifications:", err);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    try {
      const user = await getCurrentUser();
      if (!user) {
        alert("You must be logged in to edit an event");
        return;
      }

      let imageUrl = existingImageUrl;
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage
          .from("Event Images")
          .upload(fileName, imageFile);
        if (error) throw error;
        const {
          data: { publicUrl },
        } = supabase.storage.from("Event Images").getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      await updateEvent(id, {
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
      });

      await removeAllTagsFromEvent(id);
      const uniqueTagIds = selectedTags.filter((tagId, i, arr) => arr.indexOf(tagId) === i);
      for (const tagId of uniqueTagIds) {
        await addTagToEvent(id, tagId.toString());
      }

      await sendNotifications(title);
      navigate(`/events/${id}`);
    } catch (error: any) {
      console.error("Error updating event:", error);
      alert("Failed to update event: " + (error?.message || JSON.stringify(error)));
    }
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const styles = `
    .edit-event-page {
      color: black;
      font-family: Sans-Serif;
    }
    .edit-event-page h1 {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-top: 40px;
    }
    .edit-event-page h2 {
      font-size: 18px;
    }
  `;

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-black">Loading event...</div>;
  }

  return (
    <>
      <style>{styles}</style>
      <div className="edit-event-page">
        <h1 style={{ marginTop: 20, marginBottom: 4 }}>Edit Event</h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: 0 }}>
          Changes will notify all RSVPed attendees.
        </p>
        <form onSubmit={handleSubmit} style={{ padding: 20 }}>
          <h1 style={{ marginTop: 20 }}>Basic Info</h1>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
            <h2>Event Title</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ backgroundColor: "lightgray", borderRadius: "5px", width: "40%" }}
            />
            <h2>Event Summary</h2>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={{ backgroundColor: "lightgray", borderRadius: "5px", width: "40%", height: 100 }}
            />
            <h2>Tags</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {tags.map((tag) => (
                <button
                  key={tag.tag_id}
                  type="button"
                  onClick={() => toggleTag(tag.tag_id)}
                  style={{
                    border: selectedTags.includes(tag.tag_id) ? "2px solid #7793C2" : "1.5px solid black",
                    borderRadius: "5px",
                    padding: "10px 30px",
                    backgroundColor: selectedTags.includes(tag.tag_id) ? "#7793C2" : "white",
                  }}
                >
                  {tag.tag_name}
                </button>
              ))}
            </div>
          </div>
          <h1>Date & Time</h1>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
            <div>
              <p style={{ textAlign: "center", marginBottom: "5px" }}>Start Time</p>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                style={{ backgroundColor: "lightgray", borderRadius: "5px", padding: "5px" }}
              />
            </div>
            <div>
              <p style={{ textAlign: "center", marginBottom: "5px" }}>End Time</p>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                style={{ backgroundColor: "lightgray", borderRadius: "5px", padding: "5px" }}
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
              style={{ backgroundColor: "lightgray", borderRadius: "5px", width: "40%", margin: "10px 0" }}
            />
            <h2>Location Address</h2>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ backgroundColor: "lightgray", borderRadius: "5px", width: "40%", marginTop: 10 }}
            />
            <h1>Details</h1>
            <h2>Description</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ backgroundColor: "lightgray", borderRadius: "5px", width: "40%", height: 100 }}
            />
            <h2 style={{ margin: "10px 0" }}>Event Image</h2>
            {existingImageUrl && !imageFile && (
              <div style={{ marginBottom: 8 }}>
                <img src={existingImageUrl} alt="Current event" style={{ width: 120, borderRadius: 5 }} />
                <p style={{ fontSize: 12, color: "#666" }}>Current image — upload a new one to replace</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            <h2>Capacity</h2>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              style={{ backgroundColor: "lightgray", borderRadius: "5px", width: "40%", marginTop: 10 }}
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
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{ backgroundColor: "#BAC67A", padding: "10px 20px", borderRadius: "5px" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: "#7793C2", padding: "10px 20px", borderRadius: "5px" }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
