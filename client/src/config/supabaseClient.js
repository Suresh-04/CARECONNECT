import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-supabase-project') &&
    supabaseAnonKey !== 'your-supabase-anon-key-here' &&
    supabaseAnonKey.trim().length > 0
  );
};

let client = null;

if (isSupabaseConfigured()) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  } catch (err) {
    console.error('[CARECONNECT] Failed to create Supabase client:', err);
  }
} else {
  console.info('[CARECONNECT] Supabase credentials not set. Running in preview/demo mode.');
}

export const supabase = client;

