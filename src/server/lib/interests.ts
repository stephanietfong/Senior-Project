import { supabase } from "@server/supabase";

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

// REPLACE ALL USER INTERESTS FOR A USER
export const replaceUserInterests = async (
  userId: string,
  tagIds: string[],
) => {
  const uniqueTagIds = tagIds.filter(
    (tagId, index, allTagIds) => allTagIds.indexOf(tagId) === index,
  );

  const { data: existingRows, error: fetchError } = await supabase
    .from("user_interests")
    .select("tag_id")
    .eq("user_id", userId);

  if (fetchError) throw fetchError;

  const existingTagIds = (existingRows ?? []).map((row: any) => row.tag_id);
  const tagsToRemove = existingTagIds.filter(
    (tagId: string) => !uniqueTagIds.includes(tagId),
  );
  const tagsToAdd = uniqueTagIds.filter(
    (tagId) => !existingTagIds.includes(tagId),
  );

  if (tagsToRemove.length > 0) {
    await Promise.all(
      tagsToRemove.map((tagId) => removeUserInterest(userId, tagId)),
    );
  }

  if (tagsToAdd.length === 0) {
    return;
  }

  await Promise.all(
    tagsToAdd.map(async (tagId) => {
      try {
        await addUserInterest(userId, tagId);
      } catch (error: any) {
        if (
          error?.code !== "23505" &&
          !error?.message?.includes("duplicate key value")
        ) {
          throw error;
        }
      }
    }),
  );
};
