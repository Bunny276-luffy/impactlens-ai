import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl) {
  console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL environment variable is missing.');
}
if (!supabaseServiceKey) {
  console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY environment variable is missing.');
}

// Global Supabase Admin Client for secure server-side actions
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Scoped Client for enforcing Row Level Security (RLS)
export const createScopedClient = (jwtToken: string) => {
  return createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', {
    global: {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
};

export default supabase;
