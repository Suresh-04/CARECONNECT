import React from 'react';
import { 
  Users, 
  Stethoscope, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Bed, 
  Video, 
  CreditCard 
} from 'lucide-react';

export default function PortalEntry({ onSelectRole }) {
  const portals = [
    {
      role: 'patient',
      title: 'Patient Portal',
      badge: 'For Individuals & Families',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      icon: Users,
      iconBg: 'bg-sky-500',
      accentBorder: 'hover:border-sky-500',
      description: 'Take charge of your health journey with direct access to medical records, digital prescriptions, and on-demand teleconsultations.',
      features: [
        { icon: Calendar, text: 'Instant Appointment Scheduling' },
        { icon: FileText, text: 'Encrypted EHR & Lab Reports' },
        { icon: Video, text: 'HD Video Consultations with Specialists' },
        { icon: CreditCard, text: 'Insurance Claims & Transparent Billing' }
      ],
      buttonText: 'Enter Patient Portal',
      buttonBg: 'bg-sky-600 hover:bg-sky-700 text-white'
    },
    {
      role: 'doctor',
      title: 'Doctor Portal',
      badge: 'For Licensed Practitioners',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      icon: Stethoscope,
      iconBg: 'bg-teal-600',
      accentBorder: 'hover:border-teal-500',
      description: 'Streamline your clinical workflow, manage patient queues, issue e-prescriptions, and coordinate with hospital departments securely.',
      features: [
        { icon: Calendar, text: 'Smart Multi-Clinic Calendar' },
        { icon: FileText, text: 'Digital Rx & Diagnostics Ordering' },
        { icon: Users, text: 'Longitudinal Patient History Tracking' },
        { icon: ShieldCheck, text: 'HIPAA-Compliant Encrypted Notes' }
      ],
      buttonText: 'Enter Doctor Portal',
      buttonBg: 'bg-teal-600 hover:bg-teal-700 text-white'
    },
    {
      role: 'hospital',
      title: 'Hospital & Clinic Network',
      badge: 'For Healthcare Administrators',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: Building2,
      iconBg: 'bg-indigo-600',
      accentBorder: 'hover:border-indigo-500',
      description: 'Centralize admissions, monitor ICU & general bed occupancy in real-time, dispatch emergency units, and manage staffing resources.',
      features: [
        { icon: Bed, text: 'Real-Time Bed & ICU Availability Tracking' },
        { icon: Users, text: 'Staff Roster & On-Duty Physician Routing' },
        { icon: FileText, text: 'Inter-Hospital Referral Network' },
        { icon: ShieldCheck, text: 'Enterprise RLS & Department Audit Logs' }
      ],
      buttonText: 'Enter Hospital Portal',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-700 text-white'
    }
  ];

  return (
    <section id="portals" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
            <span>Specialized Portals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Tailored Experiences for Every Care Stakeholder
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Select your role to access dedicated dashboards, tools, and secure communication channels built specifically for your clinical and administrative needs.
          </p>
        </div>

        {/* Portal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.role}
                className={`bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${portal.accentBorder} group`}
              >
                <div className="space-y-6">
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl ${portal.iconBg} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${portal.badgeColor}`}>
                      {portal.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {portal.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {portal.description}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    {portal.features.map((feature, idx) => {
                      const FeatIcon = feature.icon;
                      return (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700">
                          <div className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                            <FeatIcon className="w-3.5 h-3.5" />
                          </div>
                          <span>{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Button Action */}
                <div className="pt-8">
                  <button
                    onClick={() => onSelectRole(portal.role)}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer ${portal.buttonBg}`}
                  >
                    <span>{portal.buttonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

