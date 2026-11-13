import React, { useState } from 'react';
import { 
  Heart, 
  Menu, 
  X, 
  ShieldCheck, 
  PhoneCall, 
  UserCircle2, 
  Building2, 
  Stethoscope 
} from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-slate-900">
                    CARE<span className="text-sky-600">CONNECT</span>
                  </span>
                  <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                    Health
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 tracking-wide">
                  Connecting Care. Saving Lives.
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">
              Medical Services
            </a>
            <a href="#portals" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">
              Portals
            </a>
            <a href="#emergency" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">
              Emergency Response
            </a>
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors">
              Security & Compliance
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:911"
              className="flex items-center gap-2 text-rose-600 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors border border-rose-200"
              title="Immediate Emergency Hotline"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              <span>SOS Emergency: 911</span>
            </a>

            <button
              onClick={() => onOpenAuth('patient')}
              className="flex items-center gap-2 text-slate-700 hover:text-sky-600 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
            >
              <UserCircle2 className="w-4 h-4" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => onOpenAuth('patient')}
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-sky-600/25 transition-all cursor-pointer"
            >
              <span>Get Started</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Medical Services
          </a>
          <a
            href="#portals"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Portals (Patient / Doctor / Hospital)
          </a>
          <a
            href="#emergency"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Emergency Response
          </a>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth('patient');
              }}
              className="w-full text-center bg-sky-600 text-white font-bold py-2.5 rounded-lg shadow-sm"
            >
              Open CARECONNECT Portal
            </button>
            <a
              href="tel:911"
              className="w-full text-center bg-rose-50 text-rose-600 font-bold py-2.5 rounded-lg border border-rose-200 flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              Emergency SOS (911)
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

