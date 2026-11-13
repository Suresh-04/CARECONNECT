import React, { useState, useEffect } from 'react';
import { fetchBackendHealth } from '../api/healthApi';
import { isSupabaseConfigured } from '../config/supabaseClient';
import { Activity, CheckCircle2, AlertCircle, RefreshCw, Database, Server } from 'lucide-react';

export default function HealthStatusBanner() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchBackendHealth();
    if (result.success) {
      setHealthData(result.data);
    } else {
      setError(result.error);
    }
    setLastChecked(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs py-2 px-4 text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-200">CARECONNECT System Status:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Backend Status */}
          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-sky-400" />
            <span>API Server:</span>
            {loading ? (
              <span className="text-amber-400 font-mono">Checking...</span>
            ) : healthData ? (
              <span className="inline-flex items-center text-emerald-400 font-semibold gap-1">
                <CheckCircle2 className="w-3 h-3" /> Online (Port 5000)
              </span>
            ) : (
              <span className="inline-flex items-center text-rose-400 font-semibold gap-1" title={error}>
                <AlertCircle className="w-3 h-3" /> Offline (run server)
              </span>
            )}
          </div>

          {/* Supabase Status */}
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-teal-400" />
            <span>Supabase DB:</span>
            {supabaseReady ? (
              <span className="inline-flex items-center text-emerald-400 font-semibold gap-1">
                <CheckCircle2 className="w-3 h-3" /> Configured
              </span>
            ) : (
              <span className="inline-flex items-center text-amber-400 font-semibold gap-1">
                <AlertCircle className="w-3 h-3" /> Add credentials in .env
              </span>
            )}
          </div>

          {/* Refresh button */}
          <button
            onClick={checkHealth}
            disabled={loading}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded cursor-pointer"
            title="Probe backend health"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-sky-400' : ''}`} />
            <span>Check</span>
            {lastChecked && <span className="text-[10px] text-slate-400 hidden sm:inline">({lastChecked})</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

