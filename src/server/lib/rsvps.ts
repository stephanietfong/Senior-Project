import { supabase } from "@server/supabase";

// GET RSVPS FOR AN EVENT
export const getRSVPsForEvent = async (eventId: string) => {
  const { data, error } = await supabase
    .from("rsvps")
    .select(
      `
      *,
      user:users(user_id, display_name)
    `,
    )
    .eq("event_id", eventId);

  if (error) throw error;
  return data;
};

// GET EVENTS A USER HAS RSVPed TO
export const getUpcomingRSVPEventsForUser = async (userId: string) => {
  const nowIso = new Date().toISOString();

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

  const rows = (data || [])
    .filter((row: any) => row.event && row.event.start_time > nowIso)
    .sort((a: any, b: any) =>
      a.event.start_time.localeCompare(b.event.start_time),
    );

  return rows;
};

export const getRSVPCountForEvent = async (eventId: string) => {
  const { count, error } = await supabase
    .from("rsvps")
    .select("rsvp_id", { count: "exact", head: true })
    .eq("event_id", eventId);

  if (error) throw error;
  return count ?? 0;
};

// CREATE OR UPDATE RSVP
export const createOrUpdateRSVP = async (userId: string, eventId: string) => {
  const { data, error } = await supabase
    .from("rsvps")
    .upsert({
      user_id: userId,
      event_id: eventId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// DELETE RSVP
export const deleteRSVP = async (userId: string, eventId: string) => {
  const { error } = await supabase
    .from("rsvps")
    .delete()
    .eq("user_id", userId)
    .eq("event_id", eventId);

  if (error) throw error;
};

// CHECK IF A USER HAS RSVPED TO AN EVENT
export const checkRSVPForSingleUserAndEvent = async (
  userId: string,
  eventId: string,
) => {
  const { count, error } = await supabase
    .from("rsvps")
    .select("rsvp_id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("event_id", eventId);

  if (error) throw error;

  if (count === 1) {
    return true;
  }
  return false;
};
