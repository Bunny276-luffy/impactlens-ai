import { NextRequest } from 'next/server';
import { UserProfile } from './types';
import { supabase } from './supabase';

/**
 * Extracts and verifies the Bearer token from the Authorization header
 * using Supabase. Then fetches the user's profile.
 */
export async function verifyAuth(req: NextRequest): Promise<UserProfile | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  if (!token || token.length < 10) {
    return null;
  }

  // Get the user from Supabase using the token
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    console.error('Auth verification failed:', error?.message);
    return null;
  }

  // Fetch the profile associated with this user
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    console.error('Profile fetch failed:', profileError?.message);
    // Return a minimal profile if the trigger hasn't completed yet
    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || 'User',
      role: user.user_metadata?.role || 'Volunteer',
      ngo_id: null,
      avatar_url: null,
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
    };
  }

  return profile as UserProfile;
}
