
import { useEffect, useState } from 'react';
import {
    CalendarDays,
    Clock,
    Send,
    LoaderCircle
} from 'lucide-react';

import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';

const statusStyles = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700',
    cancelled: 'bg-slate-100 text-slate-600',
    completed: 'bg-blue-50 text-blue-700'
};

export default function AppointmentBooking({ showBookingForm = false }) {
    const { user } = useAuth();

    const [appointmentDate, setAppointmentDate] = useState('');
    const [reason, setReason] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const loadAppointments = async () => {
        if (!user || !supabase) {
            setLoading(false);
            return;
        }

        setLoading(true);

        const { data, error } = await supabase.rpc(
            'get_my_appointments'
        );

        if (error) {
            setMessage(error.message);
        } else {
            setAppointments(data || []);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadAppointments();
    }, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        if (!appointmentDate || !reason.trim()) {
            setMessage('Please complete all fields.');
            return;
        }

        const selectedDate = new Date(appointmentDate);

        if (
            Number.isNaN(selectedDate.getTime()) ||
            selectedDate <= new Date()
        ) {
            setMessage('Please select a future appointment date and time.');
            return;
        }

        setSubmitting(true);

        const { error } = await supabase
            .from('appointments')
            .insert({
                patient_id: user.id,
                appointment_date: selectedDate.toISOString(),
                reason: reason.trim()
            });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage('Appointment request submitted successfully!');
            setAppointmentDate('');
            setReason('');
            await loadAppointments();
        }

        setSubmitting(false);
    };

    return (
        <section className="space-y-6">
            {showBookingForm && (
                <div>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-slate-800">
                            Book an Appointment
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Submit a new appointment request.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Preferred Date and Time
                            </label>

                            <div className="relative">
                                <CalendarDays
                                    size={19}
                                    className="absolute left-3 top-3 text-slate-400"
                                />

                                <input
                                    type="datetime-local"
                                    value={appointmentDate}
                                    onChange={(event) =>
                                        setAppointmentDate(event.target.value)
                                    }
                                    min={new Date(
                                        Date.now() -
                                        new Date().getTimezoneOffset() * 60000
                                    ).toISOString().slice(0, 16)}
                                    required
                                    className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Reason for Appointment
                            </label>

                            <textarea
                                value={reason}
                                onChange={(event) =>
                                    setReason(event.target.value)
                                }
                                placeholder="Briefly describe why you need an appointment..."
                                rows={4}
                                maxLength={1000}
                                required
                                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                            />
                        </div>

                        <p className="text-xs text-slate-500">
                            A doctor will review your appointment request.
                        </p>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? (
                                <LoaderCircle
                                    size={18}
                                    className="animate-spin"
                                />
                            ) : (
                                <Send size={18} />
                            )}

                            {submitting
                                ? 'Submitting...'
                                : 'Request Appointment'}
                        </button>

                        {message && (
                            <p role="status" className="text-sm text-sky-700">
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-slate-800">
                    My Appointment Requests
                </h3>

                {loading ? (
                    <p className="text-sm text-slate-500">
                        Loading appointments...
                    </p>
                ) : appointments.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        You have not requested any appointments yet.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {appointments.map((appointment) => (
                            <article
                                key={appointment.appointment_id}
                                className="rounded-lg border border-slate-200 p-4"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <Clock
                                            size={17}
                                            className="text-sky-600"
                                        />
                                        {new Date(
                                            appointment.appointment_date
                                        ).toLocaleString()}
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[appointment.status] ||
                                            'bg-slate-100 text-slate-600'
                                            }`}
                                    >
                                        {appointment.status}
                                    </span>
                                </div>

                                <div className="mt-3 space-y-2">
                                    <p className="text-sm text-slate-600">
                                        {appointment.reason}
                                    </p>

                                    <p className="text-sm font-medium text-slate-700">
                                        Doctor:{' '}
                                        {appointment.doctor_name || 'Not assigned yet'}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
