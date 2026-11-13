import React from 'react';
import { ShieldCheck, HeartHandshake, Zap, Building, Lock, Award } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    { label: 'Verified Healthcare Facilities', value: '450+', sub: 'Hospitals & Medical Centers' },
    { label: 'Licensed Medical Practitioners', value: '8,500+', sub: 'Board-Certified Specialists' },
    { label: 'Active Care Consultations', value: '1.2M+', sub: 'Secure Patient Encounters' },
    { label: 'Avg Emergency Response Time', value: '< 4.5 min', sub: 'Triage & Ambulance Routing' }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white relative overflow-hidden">
      {/* Background ambient pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Badges */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Enterprise Healthcare Grade Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Built for Medical Precision, Privacy, and Unwavering Uptime
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Every layer of CARECONNECT is architected around patient confidentiality, low-latency telemetry, and strict regulatory compliance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300 mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-white mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-slate-400">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Security & Compliance Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-700/60">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">PostgreSQL Row-Level Security (RLS)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Granular access controls enforce that only verified patients and treating physicians access protected health records.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Sub-100ms Telemetry Sync</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hospital bed changes and doctor schedules propagate instantly using Supabase Realtime WebSocket listeners.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Audit-Ready Compliance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Immutable audit trails track every medical record view and modification for HIPAA, GDPR, and medical board compliance.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

