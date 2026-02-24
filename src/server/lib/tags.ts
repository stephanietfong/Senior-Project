import { supabase } from "../supabase";

// GET ALL TAGS
export const getAllTags = async () => {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("tag_name", { ascending: true });

  if (error) throw error;
  return data;
};
