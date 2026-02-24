import { supabase } from "../supabase";

// GET USER INTERESTS BY USER ID
export const getUserInterests = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_interests")
    .select(
      `
      user_interest_id,
      tag:tags(tag_id, tag_name)
    `,
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data?.map((item: any) => item.tag) || [];
};

// ADD USER INTEREST BY USER ID AND TAG ID
export const addUserInterest = async (userId: string, tagId: string) => {
  const { data, error } = await supabase
    .from("user_interests")
    .insert({ user_id: userId, tag_id: tagId })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// REMOVE USER INTEREST BY USER ID AND TAG ID
export const removeUserInterest = async (userId: string, tagId: string) => {
  const { error } = await supabase
    .from("user_interests")
    .delete()
    .eq("user_id", userId)
    .eq("tag_id", tagId);

  if (error) throw error;
};
