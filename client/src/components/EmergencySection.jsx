import React from 'react';
import { PhoneCall, AlertTriangle, Ambulance, MapPin, ShieldAlert, Clock } from 'lucide-react';

export default function EmergencySection({ onEmergencyDispatch }) {
  return (
    <section id="emergency" className="py-16 bg-rose-50/60 border-y border-rose-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-200 shadow-xl shadow-rose-500/5 relative overflow-hidden">
          
          {/* Background badge indicator */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-rose-100 rounded-full blur-3xl pointer-events-none opacity-60" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                <span>CRITICAL CARE & EMERGENCY RESPONSE</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Facing a Life-Threatening Medical Emergency?
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                If you or someone around you is experiencing chest pain, severe shortness of breath, severe trauma, or signs of stroke, do not wait for an online appointment. Connect to immediate emergency services now.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <Clock className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>24/7 Priority Hotline</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <Ambulance className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>GPS Ambulance Dispatch</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Direct Trauma Triage</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <a
                href="tel:911"
                className="w-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-base py-4 px-6 rounded-2xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-3 transition-all text-center"
              >
                <PhoneCall className="w-5 h-5 animate-bounce" />
                <span>Call Emergency: 911</span>
              </a>

              <button
                onClick={onEmergencyDispatch}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>Locate Nearest Emergency Room</span>
              </button>

              <p className="text-[11px] text-center text-slate-500 font-medium">
                Triage coordination supported across all partner hospitals.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

