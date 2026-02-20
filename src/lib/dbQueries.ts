import { supabase } from './supabase';

//authentication
export const signUp = async (
  email: string,
  password: string,
  displayName: string,
  dateOfBirth: string
) => {
  // Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // Create user profile in users table
  const { error: insertError } = await supabase.from('users').insert({
    user_id: data.user?.id,
    email,
    display_name: displayName,
    date_of_birth: dateOfBirth,
  });

  if (insertError) throw insertError;

  return data.user;
};

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data.user;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

//user queries
export const getUserById = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

//event queries
export const getEventById = async (eventId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      host:users(user_id, display_name, email),
      event_tags(tags(tag_id, tag_name))
    `)
    .eq('event_id', eventId)
    .single();
  
  if (error) throw error;
  return data;
};

//get all upcoming events
export const getUpcomingEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      host:users(user_id, display_name),
      event_tags(tags(tag_id, tag_name))
    `)
    .gt('start_time', new Date().toISOString())
    .order('start_time', { ascending: true });
  
  if (error) throw error;
  return data;
};

//get hosted events for a user
export const getHostedEvents = async (userId: string) => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      event_tags(tags(tag_id, tag_name))
    `)
    .eq('host_id', userId)
    .order('start_time', { ascending: false });
  
  if (error) throw error;
  return data;
};

//get past events a user attended (via RSVPs)
export const getPastEvents = async (userId: string) => {
  const { data, error } = await supabase
    .from('rsvps')
    .select(`
      event:events(
        *,
        host:users(user_id, display_name),
        event_tags(tags(tag_id, tag_name))
      )
    `)
    .eq('user_id', userId)
    .lt('event.end_time', new Date().toISOString())
    .order('event.end_time', { ascending: false });
  
  if (error) throw error;
  return data?.map((rsvp: any) => rsvp.event) || [];
};

//rsvp queries
export const getRSVPsForEvent = async (eventId: string) => {
  const { data, error } = await supabase
    .from('rsvps')
    .select(`
      *,
      user:users(user_id, display_name)
    `)
    .eq('event_id', eventId);
  
  if (error) throw error;
  return data;
};

export const createOrUpdateRSVP = async (
  userId: string,
  eventId: string,
  status: 'Maybe' | 'Going'
) => {
  const { data, error } = await supabase
    .from('rsvps')
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

export const deleteRSVP = async (userId: string, eventId: string) => {
  const { error } = await supabase
    .from('rsvps')
    .delete()
    .eq('user_id', userId)
    .eq('event_id', eventId);
  
  if (error) throw error;
};

//tags queries
export const getAllTags = async () => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('tag_name', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getUserInterests = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_interests')
    .select(`
      user_interest_id,
      tag:tags(tag_id, tag_name)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data?.map((item: any) => item.tag) || [];
};

export const addUserInterest = async (userId: string, tagId: string) => {
  const { data, error } = await supabase
    .from('user_interests')
    .insert({ user_id: userId, tag_id: tagId })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const removeUserInterest = async (userId: string, tagId: string) => {
  const { error } = await supabase
    .from('user_interests')
    .delete()
    .eq('user_id', userId)
    .eq('tag_id', tagId);
  
  if (error) throw error;
};

//event creation/update
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
    .from('events')
    .insert(eventData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

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
  }>
) => {
  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('event_id', eventId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const addTagToEvent = async (eventId: string, tagId: string) => {
  const { data, error } = await supabase
    .from('event_tags')
    .insert({ event_id: eventId, tag_id: tagId })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
