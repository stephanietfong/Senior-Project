import { supabase } from "../supabase";

// AUTHENTICATION
export const signUp = async (
  email: string,
  password: string,
  displayName: string,
  dateOfBirth: string,
) => {
  // Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // Create user profile in users table
  const { error: insertError } = await supabase.from("users").insert({
    user_id: data.user?.id,
    email,
    display_name: displayName,
    date_of_birth: dateOfBirth,
  });

  if (insertError) throw insertError;

  return data.user;
};

// LOGIN
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data.user;
};

// LOGOUT
export const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

// GET USER BY ID
export const getUserById = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data;
};
