import { supabase } from "../supabase";

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
    .order("start_time", { ascending: false });
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
    .eq("user_id", userId)
    .lt("event.end_time", new Date().toISOString())
    .order("event.end_time", { ascending: false });

  if (error) throw error;
  return data?.map((rsvp: any) => rsvp.event) || [];
};

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
    .insert(eventData)
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
