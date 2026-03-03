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
      status,
      event:events(
        *,
        host:users(user_id, display_name),
        event_tags(tags(tag_id, tag_name))
      )
    `,
    )
    .eq("user_id", userId)
    .gt("event.start_time", nowIso)
    .order("event.start_time", { ascending: true });

  if (error) throw error;

  return (data || []).filter((row: any) => row.event);
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
export const createOrUpdateRSVP = async (
  userId: string,
  eventId: string,
  status: "Maybe" | "Going",
) => {
  const { data, error } = await supabase
    .from("rsvps")
    .upsert({
      user_id: userId,
      event_id: eventId,
      status,
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
