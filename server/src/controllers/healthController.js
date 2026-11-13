import { config } from '../config/env.js';
import { getSupabaseClient } from '../config/supabase.js';

export async function getHealthStatus(req, res) {
  const startTime = Date.now();
  const supabaseClient = getSupabaseClient();
  let supabaseStatus = 'not_configured';
  let supabaseLatencyMs = null;

  if (supabaseClient) {
    try {
      const pingStart = Date.now();
      // Test querying auth health or a basic RPC/query to confirm connectivity
      const { error } = await supabaseClient.auth.getSession();
      supabaseLatencyMs = Date.now() - pingStart;
      supabaseStatus = error ? 'degraded' : 'connected';
    } catch (e) {
      supabaseStatus = 'unreachable';
    }
  }

  const responsePayload = {
    status: 'healthy',
    service: 'CARECONNECT Backend API',
    tagline: 'Connecting Care. Saving Lives.',
    version: '1.0.0',
    environment: config.nodeEnv,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      provider: 'Supabase PostgreSQL',
      status: supabaseStatus,
      isConfigured: Boolean(config.supabase.url && (config.supabase.serviceRoleKey || config.supabase.anonKey)),
      latencyMs: supabaseLatencyMs
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    },
    responseTimeMs: Date.now() - startTime
  };

  res.status(200).json(responsePayload);
}

export function getQuickPing(req, res) {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
}

