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

  // Increment report_count on the event
  const { data: current, error: fetchError } = await supabase
    .from("events")
    .select("report_count")
    .eq("event_id", eventId)
    .single();

  if (fetchError) throw fetchError;

  const { error: updateError } = await supabase
    .from("events")
    .update({ report_count: (current.report_count || 0) + 1 })
    .eq("event_id", eventId);

  if (updateError) throw updateError;

  return data;
};
