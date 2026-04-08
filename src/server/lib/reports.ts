import { supabase } from "@server/supabase";

export const submitReport = async (
  userId: string,
  eventId: string,
  reason: string,
) => {
  const { data, error } = await supabase
    .from("reports")
    .insert({ user_id: userId, event_id: eventId, reason })
    .select()
    .single();

  if (error) throw error;
  return data;
};
