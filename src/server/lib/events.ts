import { supabase } from "@server/supabase";

// GET ALL EVENTS FOR HOME PAGE
export const getAllEvents = async () => {
  const nowISO = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .select(
      `
        *,
        host:users(user_id, display_name, email),
        event_tags(tags(tag_id, tag_name))
      `,
    )
    .gte("start_time", nowISO)
    .order("start_time", { ascending: true });
  if (error) throw error;
  return data;
};

// GET EVENT BY ID
export const getEventById = async (eventId: string) => {
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *,
      host:users(user_id, display_name, email),
      event_tags(tags(tag_id, tag_name))
    `,
    )
    .eq("event_id", eventId)
    .single();

  if (error) throw error;
  return data;
};

// GET UPCOMING EVENTS
export const getUpcomingEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *,
      host:users(user_id, display_name),
      event_tags(tags(tag_id, tag_name))
    `,
    )
    .gt("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data;
};

// GET HOSTED EVENTS FOR A USER
export const getHostedEvents = async (userId: string) => {
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *,
      event_tags(tags(tag_id, tag_name))
    `,
    )
    .eq("host_id", userId)
    .order("start_time", { ascending: false });

  if (error) throw error;
  return data;
};

// GET PAST EVENTS A USER ATTENDED (VIA RSVPS)
export const getPastEvents = async (userId: string) => {
  const { data, error } = await supabase
    .from("rsvps")
    .select(
      `
      event:events(
        *,
        host:users(user_id, display_name),
        event_tags(tags(tag_id, tag_name))
      )
    `,
    )
    .eq("user_id", userId);

  if (error) throw error;
  // Filter for past events and sort in JS
  const now = new Date();
  const events = (data?.map((rsvp: any) => rsvp.event) || []).filter((e: any) => e.end_time && new Date(e.end_time) < now);
  events.sort((a: any, b: any) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime());
  return events;
};

function sanitizeText(str: string | undefined) {
  if (!str) return str;
  return str.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
}

// CREATE EVENT
export const createEvent = async (eventData: {
  host_id: string;
  title: string;
  summary?: string;
  location_name?: string;
  address?: string;
  image_url?: string;
  capacity?: number;
  is_18_plus?: boolean;
  is_21_plus?: boolean;
  start_time: string;
  end_time: string;
}) => {
  const { data, error } = await supabase
    .from("events")
    .insert({
      ...eventData,
      title: sanitizeText(eventData.title),
      summary: sanitizeText(eventData.summary),
      location_name: sanitizeText(eventData.location_name),
      address: sanitizeText(eventData.address),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// UPDATE EVENT
export const updateEvent = async (
  eventId: string,
  eventData: Partial<{
    host_id?: string;
    title?: string;
    summary?: string;
    location_name?: string;
    address?: string;
    image_url?: string;
    capacity?: number;
    is_18_plus?: boolean;
    is_21_plus?: boolean;
    start_time?: string;
    end_time?: string;
  }>,
) => {
  const { data, error } = await supabase
    .from("events")
    .update(eventData)
    .eq("event_id", eventId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ADD TAG TO EVENT
export const addTagToEvent = async (eventId: string, tagId: string) => {
  const { data, error } = await supabase
    .from("event_tags")
    .insert({ event_id: eventId, tag_id: tagId })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// INCREMENT LIKES FOR AN EVENT
export const incrementLikes = async (eventId: string) => {
  // get current likes
  const { data: current, error: fetchError } = await supabase
    .from("events")
    .select("likes")
    .eq("event_id", eventId)
    .single();

  if (fetchError) throw fetchError;

  // update with incremented value
  const { data, error } = await supabase
    .from("events")
    .update({ likes: (current.likes || 0) + 1 })
    .eq("event_id", eventId)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error("Failed to update likes: no rows affected");
  }
  return data;
};

// DECREMENT LIKES FOR AN EVENT
export const decrementLikes = async (eventId: string) => {
  // gets current likes
  const { data: current, error: fetchError } = await supabase
    .from("events")
    .select("likes")
    .eq("event_id", eventId)
    .single();

  if (fetchError) throw fetchError;

  // updates with decremented value
  const { data, error } = await supabase
    .from("events")
    .update({ likes: Math.max(0, (current.likes || 0) - 1) })
    .eq("event_id", eventId)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error("Failed to update likes: no rows affected");
  }
  return data;
};

// LIKE AN EVENT
export const likeEvent = async (userId: string, eventId: string) => {
  // insert like
  const { data, error } = await supabase
    .from("event_likes")
    .insert({ user_id: userId, event_id: eventId })
    .select()
    .single();

  if (error) throw error;

  // increment likes
  await incrementLikes(eventId);
  return data;
};

// UNLIKE AN EVENT
export const unlikeEvent = async (userId: string, eventId: string) => {
  // delete like
  const { error } = await supabase
    .from("event_likes")
    .delete()
    .eq("user_id", userId)
    .eq("event_id", eventId);

  if (error) throw error;

  // decrement likes
  await decrementLikes(eventId);
};

// CHECK IF USER HAS LIKED AN EVENT
export const hasLikedEvent = async (userId: string, eventId: string) => {
  const { data, error } = await supabase
    .from("event_likes")
    .select("like_id")
    .eq("user_id", userId)
    .eq("event_id", eventId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows
  return !!data;
};
