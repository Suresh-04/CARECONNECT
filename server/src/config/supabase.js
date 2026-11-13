import { createClient } from '@supabase/supabase-js';
import { config, validateEnv } from './env.js';

let supabaseClient = null;

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const isConfigured = validateEnv();

  if (!isConfigured || !config.supabase.url) {
    return null;
  }

  // Use service role key if available for backend administrative operations; otherwise fallback to anon key
  const authKey = config.supabase.serviceRoleKey || config.supabase.anonKey;

  try {
    supabaseClient = createClient(config.supabase.url, authKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    console.log('[CARECONNECT] Supabase backend client initialized successfully.');
    return supabaseClient;
  } catch (err) {
    console.error('[CARECONNECT] Failed to initialize Supabase client:', err.message);
    return null;
  }
}

export const supabase = getSupabaseClient();

