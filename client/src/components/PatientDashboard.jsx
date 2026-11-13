
import { useEffect, useState } from 'react';
import {
    Activity,
    CalendarDays,
    ClipboardList,
    FileText,
    HeartPulse,
    LogOut,
    Menu,
    ShieldCheck,
    UserRound,
    X,
    Droplet,
    PhoneCall,
    Pill,
    LoaderCircle,
    RefreshCw,
    AlertTriangle,
    Bell
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';
import AppointmentBooking from './AppointmentBooking';
import MedicalRecords from './MedicalRecords';
import BloodRequest from './BloodRequest';
import BloodRequestHistory from './BloodRequestHistory';
import EmergencyRequest from './EmergencyRequest';
import EmergencyRequestHistory from './EmergencyRequestHistory';
import Notifications from './Notifications';
import PatientProfile from './PatientProfile';

const modules = [
    {
        title: 'Appointments',
        description: 'Book and manage doctor appointments.',
        icon: CalendarDays,
        status: 'Available'
    },
    {
        title: 'Medical Records',
        description: 'Access your medical history and reports.',
        icon: FileText,
        status: 'Available'
    },
    {
        title: 'Prescriptions',
        description: 'View your prescribed medicines.',
        icon: ClipboardList,
        status: 'Available'
    },
    {
        title: 'Blood Donation',
        description: 'Connect with the blood donor network.',
        icon: Droplet,
        status: 'Available'
    },
    {
        title: 'Emergency Assistance',
        description: 'Submit and track emergency assistance requests.',
        icon: AlertTriangle,
        status: 'Available'
    }
];

function MyPrescriptions() {
    const { profile } = useAuth();

    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadPrescriptions = async () => {
        if (!profile?.id) {
            setPrescriptions([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');

        const { data, error: fetchError } = await supabase
            .from('prescriptions')
            .select('*')
            .eq('patient_id', profile.id)
            .order('prescribed_date', { ascending: false });

        if (fetchError) {
            setError(fetchError.message);
            setPrescriptions([]);
        } else {
            setPrescriptions(data || []);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadPrescriptions();
    }, [profile?.id]);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-sky-50 p-3 text-sky-600">
                        <Pill size={23} />
                    </div>

                    <div>
                        <h3 className="text-lg font-bold">My Prescriptions</h3>
                        <p className="text-sm text-slate-500">
                            Medicines prescribed by your doctor.
                        </p>
                    </div>
                </div>

                <button
                    onClick={loadPrescriptions}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-slate-500">
                    <LoaderCircle className="animate-spin" size={22} />
                    <span className="text-sm">Loading prescriptions...</span>
                </div>
            ) : error ? (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    <p>Unable to load prescriptions: {error}</p>
                    <button onClick={loadPrescriptions} className="mt-3 font-semibold underline">
                        Try again
                    </button>
                </div>
            ) : prescriptions.length === 0 ? (
                <div className="rounded-lg bg-slate-50 py-10 text-center">
                    <ClipboardList size={38} className="mx-auto mb-3 text-slate-400" />
                    <h4 className="font-semibold text-slate-700">No prescriptions yet</h4>
                    <p className="mt-1 text-sm text-slate-500">
                        Your doctor's prescriptions will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                        <article
                            key={prescription.id}
                            className="rounded-xl border border-slate-200 p-5"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
                                        <Pill size={22} />
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-800">
                                            {prescription.medication_name}
                                        </h4>
                                        <p className="text-sm text-slate-500">
                                            Prescribed on{' '}
                                            {prescription.prescribed_date
                                                ? new Date(`${prescription.prescribed_date}T00:00:00`).toLocaleDateString('en-IN')
                                                : 'Date unavailable'}
                                        </p>
                                    </div>
                                </div>

                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                    Prescribed
                                </span>
                            </div>

                            <div className="mt-5 grid gap-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-xs font-medium text-slate-500">Dosage</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {prescription.dosage}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500">Frequency</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {prescription.frequency}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500">Duration</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {prescription.duration}
                                    </p>
                                </div>
                            </div>

                            {prescription.instructions && (
                                <div className="mt-4 rounded-lg bg-slate-50 p-3">
                                    <p className="text-xs font-semibold text-slate-500">
                                        Doctor's Instructions
                                    </p>
                                    <p className="mt-1 text-sm text-slate-700">
                                        {prescription.instructions}
                                    </p>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}

            <p className="mt-5 text-xs text-slate-400">
                Follow your doctor's instructions. Contact your healthcare provider if you have questions about your prescription.
            </p>
        </div>
    );
}

export default function PatientDashboard() {
    const { profile, signOut } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);
    const [logoutError, setLogoutError] = useState('');
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [showBloodRequest, setShowBloodRequest] = useState(false);
    const [showEmergencyRequest, setShowEmergencyRequest] = useState(false);

    const handleLogout = async () => {
        setLogoutError('');

        const { error } = await signOut();

        if (error) {
            setLogoutError(error.message);
        }
    };

    const patientName = profile?.full_name || 'Patient';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-sky-600 p-2 text-white">
                            <HeartPulse size={25} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-sky-700">CARECONNECT</h1>
                            <p className="text-xs text-slate-500">Connecting Care. Saving Lives.</p>
                        </div>
                    </div>

                    <nav className="hidden items-center gap-5 md:flex">
                        <a href="#overview" className="text-sm font-medium hover:text-sky-600">Overview</a>
                        <a href="#my-profile" className="text-sm font-medium hover:text-sky-600">My Profile</a>
                        <a href="#services" className="text-sm font-medium hover:text-sky-600">Services</a>
                        <a href="#my-appointments" className="text-sm font-medium hover:text-sky-600">Appointments</a>
                        <a href="#medical-records" className="text-sm font-medium hover:text-sky-600">Records</a>
                        <a href="#prescriptions" className="text-sm font-medium hover:text-sky-600">Prescriptions</a>
                        <a href="#blood-request" className="text-sm font-medium hover:text-red-600">Request Blood</a>
                        <a href="#blood-request-history" className="text-sm font-medium hover:text-red-600">My Blood Requests</a>
                        <a href="#emergency-request" className="text-sm font-medium hover:text-red-600">Emergency</a>
                        <a href="#emergency-request-history" className="text-sm font-medium hover:text-red-600">My Emergency Requests</a>
                        <a href="#notifications" className="flex items-center gap-1 text-sm font-medium hover:text-sky-600">
                            <Bell size={16} /> Notifications
                        </a>
                        <a href="#support" className="text-sm font-medium hover:text-sky-600">Support</a>
                    </nav>

                    <div className="hidden items-center gap-3 md:flex">
                        <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
                            <UserRound size={18} className="text-sky-600" />
                            <span className="max-w-36 truncate text-sm font-medium">{patientName}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                        >
                            <LogOut size={17} /> Logout
                        </button>
                    </div>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
                        aria-label="Toggle navigation"
                    >
                        {menuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {menuOpen && (
                    <div className="space-y-4 border-t border-slate-200 bg-white p-5 md:hidden">
                        {[
                            ['#overview', 'Overview'],
                            ['#my-profile', 'My Profile'],
                            ['#services', 'Services'],
                            ['#my-appointments', 'My Appointments'],
                            ['#medical-records', 'Medical Records'],
                            ['#prescriptions', 'Prescriptions'],
                            ['#blood-request', 'Request Blood'],
                            ['#blood-request-history', 'My Blood Requests'],
                            ['#emergency-request', 'Emergency Assistance'],
                            ['#emergency-request-history', 'My Emergency Requests'],
                            ['#notifications', 'Notifications'],
                            ['#support', 'Support']
                        ].map(([href, label]) => (
                            <a
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                className="block"
                            >
                                {label}
                            </a>
                        ))}

                        <button onClick={handleLogout} className="font-semibold text-red-600">
                            Logout
                        </button>
                    </div>
                )}
            </header>

            <main className="mx-auto max-w-7xl space-y-8 px-5 py-8">
                <section
                    id="overview"
                    className="rounded-2xl bg-gradient-to-r from-sky-700 to-cyan-600 p-7 text-white shadow-lg md:p-10"
                >
                    <p className="text-sm font-medium text-sky-100">PATIENT PORTAL</p>
                    <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                        Welcome back, {patientName}!
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-sky-100 md:text-base">
                        Manage your healthcare journey in one place. Stay connected with doctors and healthcare services.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-sm text-sky-100">
                        <ShieldCheck size={19} /> Your patient portal
                    </div>
                </section>

                <section>
                    <div className="mb-5">
                        <h2 className="text-xl font-bold">Your Overview</h2>
                        <p className="mt-1 text-sm text-slate-500">Your healthcare activity at a glance.</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { title: 'Appointments', value: 'View below', icon: CalendarDays },
                            { title: 'Medical Records', value: 'View below', icon: FileText },
                            { title: 'Prescriptions', value: 'View below', icon: ClipboardList },
                            { title: 'Health Activity', value: '0', icon: Activity }
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-slate-500">{item.title}</p>
                                        <Icon className="text-sky-600" size={22} />
                                    </div>
                                    <p className="mt-4 text-xl font-bold">{item.value}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section id="services">
                    <div className="mb-5">
                        <h2 className="text-xl font-bold">Healthcare Services</h2>
                        <p className="mt-1 text-sm text-slate-500">Access your patient services.</p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {modules.map((module) => {
                            const Icon = module.icon;
                            return (
                                <article
                                    key={module.title}
                                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="mb-4 inline-flex rounded-xl bg-sky-50 p-3 text-sky-600">
                                        <Icon size={25} />
                                    </div>
                                    <h3 className="font-bold">{module.title}</h3>
                                    <p className="mt-2 min-h-12 text-sm leading-5 text-slate-500">{module.description}</p>

                                    {module.title === 'Appointments' ? (
                                        <button
                                            onClick={() => setShowBookingForm(!showBookingForm)}
                                            className="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                                        >
                                            {showBookingForm ? 'Close Booking Form' : 'Book Appointment'}
                                        </button>
                                    ) : module.title === 'Medical Records' ? (
                                        <a href="#medical-records" className="mt-4 inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700">
                                            View Records
                                        </a>
                                    ) : module.title === 'Prescriptions' ? (
                                        <a href="#prescriptions" className="mt-4 inline-block rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">
                                            View Prescriptions
                                        </a>
                                    ) : module.title === 'Blood Donation' ? (
                                        <button
                                            onClick={() => setShowBloodRequest(!showBloodRequest)}
                                            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                        >
                                            {showBloodRequest ? 'Close Request Form' : 'Request Blood'}
                                        </button>
                                    ) : module.title === 'Emergency Assistance' ? (
                                        <button
                                            onClick={() => setShowEmergencyRequest(!showEmergencyRequest)}
                                            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                        >
                                            {showEmergencyRequest ? 'Close Emergency Form' : 'Request Emergency Help'}
                                        </button>
                                    ) : (
                                        <span className="mt-4 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                            {module.status}
                                        </span>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </section>

                {showBloodRequest && (
                    <section id="blood-request">
                        <BloodRequest />
                    </section>
                )}

                <section id="blood-request-history">
                    <BloodRequestHistory />
                </section>

                {showEmergencyRequest && (
                    <section id="emergency-request">
                        <EmergencyRequest />
                    </section>
                )}

                <section id="emergency-request-history">
                    <EmergencyRequestHistory />
                </section>

                <section id="my-appointments">
                    <AppointmentBooking showBookingForm={showBookingForm} />
                </section>

                <section id="medical-records">
                    <MedicalRecords />
                </section>

                <section id="prescriptions">
                    <MyPrescriptions />
                </section>

                {/* Patient Profile */}
                <section id="my-profile">
                    <PatientProfile />
                </section>
                {/* Notifications */}
                <section id="notifications">
                    <Notifications />
                </section>

                {/* Support */}
                <section id="support" className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-xl border border-red-100 bg-red-50 p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-white p-3 text-red-600">
                                <PhoneCall size={23} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-red-800">Emergency Assistance</h3>
                                <p className="mt-1 text-sm text-red-700">
                                    For emergencies in India, call 112.
                                </p>
                                <a
                                    href="tel:112"
                                    className="mt-3 inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                >
                                    Call 112
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {logoutError && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        Logout failed: {logoutError}
                    </p>
                )}

                <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
                    © 2026 CARECONNECT. Connecting Care. Saving Lives.
                </footer>
            </main>
        </div>
    );
}



