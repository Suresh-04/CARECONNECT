import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    anonKey: process.env.SUPABASE_ANON_KEY || ''
  }
};

// Validate presence of critical variables without crashing if running initial setup
export function validateEnv() {
  const missing = [];
  if (!config.supabase.url) missing.push('SUPABASE_URL');
  if (!config.supabase.serviceRoleKey && !config.supabase.anonKey) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY');
  }

  if (missing.length > 0) {
    console.warn(`[CARECONNECT Server Warning] Missing Supabase environment variables: ${missing.join(', ')}`);
    console.warn('[CARECONNECT Server Warning] Running in limited/mock mode until credentials are provided in server/.env');
    return false;
  }
  return true;
}

