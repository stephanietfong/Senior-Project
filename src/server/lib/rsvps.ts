import { supabase } from "../supabase";

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
