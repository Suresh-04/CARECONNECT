import React from 'react';
import { Heart, ShieldCheck, PhoneCall, Mail, MapPin, Globe, Lock } from 'lucide-react';

export default function Footer({ onOpenAuth }) {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-400 flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                CARE<span className="text-sky-400">CONNECT</span>
              </span>
            </div>
            
            <p className="text-sm text-sky-400 font-semibold tracking-wide">
              Connecting Care. Saving Lives.
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The unified healthcare management platform connecting patients, board-certified medical doctors, and hospitals through real-time telemetry and encrypted medical data.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                HIPAA & SOC-2
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                <Lock className="w-4 h-4 text-sky-400" />
                RLS PostgreSQL
              </span>
            </div>
          </div>

          {/* Column 2: Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Care Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onOpenAuth('patient')} className="hover:text-white transition-colors cursor-pointer">
                  Patient Health Hub
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAuth('doctor')} className="hover:text-white transition-colors cursor-pointer">
                  Doctor Clinical Console
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAuth('hospital')} className="hover:text-white transition-colors cursor-pointer">
                  Hospital Bed Telemetry
                </button>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Diagnostic Lab Network
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Digital E-Prescriptions
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Healthcare Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-white transition-colors">Unified EHR Records</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Teleconsultations</a></li>
              <li><a href="#emergency" className="hover:text-white transition-colors">Ambulance SOS Routing</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">PostgreSQL Row Security</a></li>
              <li><a href="/api/health" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Live Health API</a></li>
            </ul>
          </div>

          {/* Column 4: Emergency & Help */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Emergency & Support
            </h4>
            <div className="space-y-2.5 text-xs">
              <a 
                href="tel:911" 
                className="flex items-center gap-2 text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Hotline: 911 / 112</span>
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>support@careconnect.health</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>24/7 Global Clinical Dispatch</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} CARECONNECT Health Platform. All rights reserved. Connecting Care. Saving Lives.
          </p>
          <div className="flex items-center gap-6">
            <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Care</a>
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Patient Privacy Policy</a>
            <a href="#hipaa" className="hover:text-slate-300 transition-colors">HIPAA Compliance</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

