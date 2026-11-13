import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Activity, 
  Users, 
  Building, 
  Stethoscope, 
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function Hero({ onSelectRole }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('doctor');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-sky-200/40 via-teal-100/30 to-blue-200/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 bg-sky-100/80 border border-sky-200 text-sky-800 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
              <span>Next-Generation Healthcare Cloud Platform</span>
            </div>

            {/* Tagline & Main Title */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Connecting Care. <br />
                <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-sky-700 bg-clip-text text-transparent">
                  Saving Lives.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
                CARECONNECT unifies patient health records, on-demand clinical consultations, and hospital bed infrastructure into one secure, real-time ecosystem.
              </p>
            </div>

            {/* Quick Interactive Search Bar */}
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-200/80 max-w-xl mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2 flex-1 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/60 focus-within:border-sky-500 focus-within:bg-white transition-all">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctor, hospital, or specialty (e.g. Cardiology)..."
                    className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => onSelectRole('patient')}
                  className="bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md shadow-sky-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Find Care</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500 px-1">
                <span className="font-semibold text-slate-600">Popular:</span>
                {['Cardiology', 'Pediatrics', 'Neurology', 'ICU Beds', 'Teleconsult'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="hover:text-sky-600 hover:bg-sky-50 px-2 py-0.5 rounded transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Entry Points */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onSelectRole('patient')}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-slate-900/15 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-sky-400" />
                <span>Patient Portal</span>
              </button>

              <button
                onClick={() => onSelectRole('doctor')}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-xl border border-slate-300 shadow-sm transition-all hover:border-slate-400 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <span>Doctor Portal</span>
              </button>

              <button
                onClick={() => onSelectRole('hospital')}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-xl border border-slate-300 shadow-sm transition-all hover:border-slate-400 cursor-pointer"
              >
                <Building className="w-4 h-4 text-sky-600" />
                <span>Hospital Network</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>HIPAA & GDPR Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-sky-600" />
                <span>256-Bit Encrypted Storage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>24/7 Real-Time Availability</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Platform Card Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card */}
              <div className="bg-white rounded-3xl shadow-2xl shadow-sky-900/10 border border-slate-200/80 p-6 space-y-6 relative z-10 backdrop-blur-xl">
                {/* Header with avatar & live telemetry */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 font-bold">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Dr. Sarah Mitchell, MD</h2>
                      <p className="text-xs text-slate-500">Chief of Cardiology • Metro Health</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold text-[11px] px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Available
                  </span>
                </div>

                {/* Patient Case Card Preview */}
                <div className="bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl p-4 border border-slate-200/60 space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Live Clinical Vitals</span>
                    <span className="text-[10px] bg-sky-100 text-sky-700 font-bold px-2 py-0.5 rounded">Synced</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-xs">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Heart Rate</p>
                      <p className="text-lg font-black text-rose-600">72 <span className="text-xs font-normal text-slate-400">bpm</span></p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-xs">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Blood Press.</p>
                      <p className="text-lg font-black text-sky-700">120/80</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-xs">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">SpO2 Level</p>
                      <p className="text-lg font-black text-teal-600">99%</p>
                    </div>
                  </div>
                </div>

                {/* Upcoming Appointment */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Upcoming Tele-Consultation</span>
                    <span className="text-sky-600 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> In 15 mins
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-xs">
                      JD
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">John Doe (Patient #4092)</p>
                      <p className="text-[11px] text-slate-500">Post-Surgery Evaluation & Prescription</p>
                    </div>
                    <button 
                      onClick={() => onSelectRole('patient')}
                      className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Join
                    </button>
                  </div>
                </div>

                {/* Quick Bed Status Indicator */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Building className="w-4 h-4 text-sky-600" />
                    City Central Hospital ICU:
                  </span>
                  <span className="font-bold text-emerald-600">4 Beds Free</span>
                </div>
              </div>

              {/* Floating Emergency Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-rose-100 flex items-center gap-3 z-20 hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Emergency Dispatch Active</p>
                  <p className="text-[11px] text-slate-500">Avg. Response Time: 4.2 mins</p>
                </div>
              </div>

              {/* Floating Cloud Sync Badge */}
              <div className="absolute -top-6 -right-4 bg-white p-3.5 rounded-2xl shadow-xl border border-teal-100 flex items-center gap-2.5 z-20 hidden sm:flex">
                <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Supabase RLS Protected</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

