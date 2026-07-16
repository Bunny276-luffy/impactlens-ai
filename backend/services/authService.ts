import { UserProfile, AuthSession } from '../lib/types';
import { supabase } from '../lib/supabase';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: UserProfile['role'];
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function registerUser(input: RegisterInput): Promise<AuthSession> {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        role: input.role,
      }
    }
  });

  if (error) {
    console.error("Supabase signUp error:", error);
    throw new Error(error?.message || String(error));
  }

  if (!data.session) {
    if (data.user) {
      // User created, but no session because email confirmation is required.
      // This is not an error! We should return a partial AuthSession or handle it.
      // We will return a fake session with the user data so the frontend can succeed.
      return {
        user: { 
          id: data.user.id, 
          email: data.user.email!, 
          name: input.name, 
          role: input.role,
          ngo_id: null,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        access_token: '', // Empty token indicates email confirmation required
        refresh_token: '',
        expires_at: Date.now() + 3600000,
      };
    }
    throw new Error('Registration failed: No session or user returned.');
  }

  if (!data.user) {
    throw new Error('Registration failed: No user returned.');
  }

  // Fetch created profile (created via database trigger)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  const userProfile: UserProfile = profile || {
    id: data.user.id,
    email: data.user.email!,
    name: input.name,
    role: input.role,
    ngo_id: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return {
    user: userProfile,
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at ? data.session.expires_at * 1000 : Date.now() + 3600000,
  };
}

export async function loginUser(input: LoginInput): Promise<AuthSession> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.session || !data.user) {
    throw new Error('Authentication failed: Please check if you need to verify your email address.');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  const userProfile: UserProfile = profile || {
    id: data.user.id,
    email: data.user.email!,
    name: data.user.user_metadata?.name || 'User',
    role: data.user.user_metadata?.role || 'Volunteer',
    ngo_id: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return {
    user: userProfile,
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at ? data.session.expires_at * 1000 : Date.now() + 3600000,
  };
}

export async function logoutUser(token: string): Promise<void> {
  // To log out a specific session safely, we need the token
  const { error } = await supabase.auth.admin.signOut(token);
  if (error) {
    // Fallback if admin signout is restricted for the token
    await supabase.auth.signOut();
  }
}

export async function getSession(token: string): Promise<UserProfile | null> {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile as UserProfile || null;
}
