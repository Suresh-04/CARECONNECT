
import { useEffect, useState } from 'react';
import {
    HeartPulse,
    CalendarDays,
    Clock,
    CheckCircle,
    XCircle,
    LogOut,
    UserRound,
    LoaderCircle,
    RefreshCw,
    ShieldCheck,
    FileText,
    Save,
    Pill,
    ClipboardList
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';

export default function DoctorDashboard() {
    const { profile, signOut } = useAuth();

    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);

    const [loading, setLoading] = useState(true);
    const [patientsLoading, setPatientsLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [savingRecord, setSavingRecord] = useState(false);
    const [savingPrescription, setSavingPrescription] = useState(false);

    const [message, setMessage] = useState('');
    const [patientError, setPatientError] = useState('');

    const [recordForm, setRecordForm] = useState({
        patient_id: '',
        record_title: '',
        diagnosis: '',
        treatment: '',
        notes: '',
        record_date: new Date().toISOString().slice(0, 10)
    });

    const [prescriptionForm, setPrescriptionForm] = useState({
        patient_id: '',
        medication_name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        prescribed_date: new Date().toISOString().slice(0, 10)
    });

    const isVerified = profile?.verification_status === 'verified';

    // Load pending appointments
    const loadAppointments = async () => {
        if (!isVerified) {
            setLoading(false);
            return;
        }

        setLoading(true);

        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('status', 'pending')
            .is('doctor_id', null)
            .order('created_at', { ascending: false });

        if (error) {
            setMessage(error.message);
        } else {
            setAppointments(data || []);
        }

        setLoading(false);
    };

    // Load patients assigned to this doctor
    const loadPatients = async () => {
        if (!isVerified) return;

        setPatientsLoading(true);
        setPatientError('');

        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('role', 'patient')
            .order('full_name', { ascending: true });

        if (error) {
            setPatientError(error.message);
            setPatients([]);
        } else {
            setPatients(data || []);
        }

        setPatientsLoading(false);
    };

    useEffect(() => {
        if (isVerified) {
            loadAppointments();
            loadPatients();
        } else {
            setLoading(false);
        }
    }, [isVerified]);

    // Confirm or reject appointment
    const respondToAppointment = async (appointmentId, status) => {
        setUpdatingId(appointmentId);
        setMessage('');

        const { data, error } = await supabase
            .from('appointments')
            .update({
                doctor_id: profile.id,
                status
            })
            .eq('id', appointmentId)
            .eq('status', 'pending')
            .is('doctor_id', null)
            .select();

        if (error) {
            setMessage(error.message);
        } else if (!data || data.length === 0) {
            setMessage('This request is no longer available. Please refresh.');
        } else {
            setMessage(
                status === 'confirmed'
                    ? 'Appointment confirmed successfully!'
                    : 'Appointment request rejected.'
            );

            await loadAppointments();
            await loadPatients();
        }

        setUpdatingId(null);
    };

    // Update medical record form
    const handleRecordChange = (event) => {
        const { name, value } = event.target;

        setRecordForm(previous => ({
            ...previous,
            [name]: value
        }));
    };

    // Save medical record
    const handleSaveRecord = async (event) => {
        event.preventDefault();

        if (!isVerified || !profile?.id) {
            setMessage('Only verified doctors can create medical records.');
            return;
        }

        setSavingRecord(true);
        setMessage('');

        const { error } = await supabase
            .from('medical_records')
            .insert({
                patient_id: recordForm.patient_id,
                doctor_id: profile.id,
                record_title: recordForm.record_title.trim(),
                diagnosis: recordForm.diagnosis.trim(),
                treatment: recordForm.treatment.trim(),
                notes: recordForm.notes.trim(),
                record_date: recordForm.record_date
            });

        if (error) {
            setMessage(`Unable to save medical record: ${error.message}`);
        } else {
            setMessage('Medical record saved successfully!');

            setRecordForm({
                patient_id: '',
                record_title: '',
                diagnosis: '',
                treatment: '',
                notes: '',
                record_date: new Date().toISOString().slice(0, 10)
            });
        }

        setSavingRecord(false);
    };

    // Update prescription form
    const handlePrescriptionChange = (event) => {
        const { name, value } = event.target;

        setPrescriptionForm(previous => ({
            ...previous,
            [name]: value
        }));
    };

    // Save prescription
    const handleSavePrescription = async (event) => {
        event.preventDefault();

        if (!isVerified || !profile?.id) {
            setMessage('Only verified doctors can create prescriptions.');
            return;
        }

        if (!prescriptionForm.patient_id) {
            setMessage('Please select a patient for the prescription.');
            return;
        }

        setSavingPrescription(true);
        setMessage('');

        const { error } = await supabase
            .from('prescriptions')
            .insert({
                patient_id: prescriptionForm.patient_id,
                doctor_id: profile.id,
                medication_name: prescriptionForm.medication_name.trim(),
                dosage: prescriptionForm.dosage.trim(),
                frequency: prescriptionForm.frequency.trim(),
                duration: prescriptionForm.duration.trim(),
                instructions: prescriptionForm.instructions.trim(),
                prescribed_date: prescriptionForm.prescribed_date
            });

        if (error) {
            setMessage(`Unable to save prescription: ${error.message}`);
        } else {
            setMessage('Prescription saved successfully!');

            setPrescriptionForm({
                patient_id: '',
                medication_name: '',
                dosage: '',
                frequency: '',
                duration: '',
                instructions: '',
                prescribed_date: new Date().toISOString().slice(0, 10)
            });
        }

        setSavingPrescription(false);
    };

    const handleLogout = async () => {
        const { error } = await signOut();

        if (error) {
            setMessage(error.message);
        }
    };

    const inputClass =
        'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100';

    const labelClass =
        'mb-2 block text-sm font-semibold text-slate-700';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">

            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-sky-600 p-2 text-white">
                            <HeartPulse size={25} />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-sky-700">
                                CARECONNECT
                            </h1>
                            <p className="text-xs text-slate-500">
                                Doctor Portal
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                        <LogOut size={17} />
                        Logout
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-8 px-5 py-8">

                {/* Welcome */}
                <section className="rounded-2xl bg-gradient-to-r from-sky-700 to-cyan-600 p-8 text-white">
                    <p className="text-sm font-medium text-sky-100">
                        DOCTOR PORTAL
                    </p>

                    <h2 className="mt-3 text-3xl font-bold">
                        Welcome, Dr. {profile?.full_name || 'Doctor'}!
                    </h2>

                    <p className="mt-3 text-sky-100">
                        Manage patient appointments, medical records and prescriptions.
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm">
                        <ShieldCheck size={19} />
                        {isVerified ? 'Verified Doctor' : 'Verification pending'}
                    </div>
                </section>

                {!isVerified ? (
                    <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                        <h3 className="font-bold text-amber-800">
                            Account verification required
                        </h3>

                        <p className="mt-2 text-sm text-amber-700">
                            Your doctor account must be verified by an administrator
                            before you can access patient appointments and medical records.
                        </p>
                    </section>
                ) : (
                    <>
                        {/* Pending appointments */}
                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold">
                                        Pending Appointments
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Review and respond to patient requests.
                                    </p>
                                </div>

                                <button
                                    onClick={loadAppointments}
                                    disabled={loading}
                                    className="flex items-center gap-2 rounded-lg bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100 disabled:opacity-50"
                                >
                                    <RefreshCw size={17} />
                                    Refresh
                                </button>
                            </div>

                            <div className="mt-6">
                                {loading ? (
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <LoaderCircle className="animate-spin" size={20} />
                                        Loading appointments...
                                    </div>
                                ) : appointments.length === 0 ? (
                                    <p className="rounded-lg bg-slate-50 p-5 text-center text-sm text-slate-500">
                                        No pending appointment requests.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {appointments.map(appointment => (
                                            <article
                                                key={appointment.id}
                                                className="rounded-xl border border-slate-200 p-5"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <UserRound className="text-sky-600" size={20} />
                                                        <span className="font-semibold">
                                                            Patient appointment request
                                                        </span>
                                                    </div>

                                                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                                        Pending
                                                    </span>
                                                </div>

                                                <div className="mt-4 space-y-2 text-sm text-slate-600">
                                                    <p className="flex items-center gap-2">
                                                        <CalendarDays size={17} />
                                                        {new Date(appointment.appointment_date).toLocaleDateString()}
                                                    </p>

                                                    <p className="flex items-center gap-2">
                                                        <Clock size={17} />
                                                        {new Date(appointment.appointment_date).toLocaleTimeString()}
                                                    </p>
                                                </div>

                                                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                                                    <p className="text-xs font-semibold uppercase text-slate-500">
                                                        Patient concern
                                                    </p>

                                                    <p className="mt-2 text-sm text-slate-700">
                                                        {appointment.reason}
                                                    </p>
                                                </div>

                                                <div className="mt-5 flex flex-wrap gap-3">
                                                    <button
                                                        onClick={() => respondToAppointment(appointment.id, 'confirmed')}
                                                        disabled={updatingId !== null}
                                                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        <CheckCircle size={17} />
                                                        Confirm
                                                    </button>

                                                    <button
                                                        onClick={() => respondToAppointment(appointment.id, 'rejected')}
                                                        disabled={updatingId !== null}
                                                        className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                                                    >
                                                        <XCircle size={17} />
                                                        Reject
                                                    </button>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Add Medical Record */}
                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-sky-100 p-3 text-sky-700">
                                    <FileText size={24} />
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold">
                                        Add Medical Record
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Create a medical record for a patient.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSaveRecord} className="mt-6 space-y-5">
                                <div>
                                    <label htmlFor="record_patient_id" className={labelClass}>
                                        Select Patient *
                                    </label>

                                    <select
                                        id="record_patient_id"
                                        name="patient_id"
                                        value={recordForm.patient_id}
                                        onChange={handleRecordChange}
                                        required
                                        disabled={patientsLoading}
                                        className={inputClass}
                                    >
                                        <option value="">Choose a patient</option>
                                        {patients.map(patient => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.full_name || 'Unnamed Patient'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="record_title" className={labelClass}>
                                        Record Title *
                                    </label>
                                    <input
                                        id="record_title"
                                        name="record_title"
                                        value={recordForm.record_title}
                                        onChange={handleRecordChange}
                                        placeholder="General Health Checkup"
                                        required
                                        maxLength={150}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="diagnosis" className={labelClass}>
                                        Diagnosis
                                    </label>
                                    <textarea
                                        id="diagnosis"
                                        name="diagnosis"
                                        value={recordForm.diagnosis}
                                        onChange={handleRecordChange}
                                        placeholder="Enter diagnosis details..."
                                        rows={3}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="treatment" className={labelClass}>
                                        Treatment / Prescription
                                    </label>
                                    <textarea
                                        id="treatment"
                                        name="treatment"
                                        value={recordForm.treatment}
                                        onChange={handleRecordChange}
                                        placeholder="Enter treatment details..."
                                        rows={3}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="notes" className={labelClass}>
                                        Additional Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={recordForm.notes}
                                        onChange={handleRecordChange}
                                        placeholder="Additional notes..."
                                        rows={3}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="record_date" className={labelClass}>
                                        Record Date *
                                    </label>
                                    <input
                                        id="record_date"
                                        name="record_date"
                                        type="date"
                                        value={recordForm.record_date}
                                        onChange={handleRecordChange}
                                        max={new Date().toISOString().slice(0, 10)}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={savingRecord || patientsLoading || patients.length === 0}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
                                >
                                    {savingRecord ? (
                                        <>
                                            <LoaderCircle className="animate-spin" size={18} />
                                            Saving Record...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save Medical Record
                                        </>
                                    )}
                                </button>
                            </form>
                        </section>

                        {/* Add Prescription */}
                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                                    <Pill size={24} />
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold">
                                        Create Prescription
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Create a prescription for an assigned patient.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSavePrescription} className="mt-6 space-y-5">
                                <div>
                                    <label htmlFor="prescription_patient_id" className={labelClass}>
                                        Select Patient *
                                    </label>

                                    <select
                                        id="prescription_patient_id"
                                        name="patient_id"
                                        value={prescriptionForm.patient_id}
                                        onChange={handlePrescriptionChange}
                                        required
                                        disabled={patientsLoading}
                                        className={inputClass}
                                    >
                                        <option value="">Choose a patient</option>
                                        {patients.map(patient => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.full_name || 'Unnamed Patient'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="medication_name" className={labelClass}>
                                        Medicine Name *
                                    </label>
                                    <input
                                        id="medication_name"
                                        name="medication_name"
                                        value={prescriptionForm.medication_name}
                                        onChange={handlePrescriptionChange}
                                        placeholder="Enter medicine name"
                                        required
                                        maxLength={150}
                                        className={inputClass}
                                    />
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="dosage" className={labelClass}>
                                            Dosage *
                                        </label>
                                        <input
                                            id="dosage"
                                            name="dosage"
                                            value={prescriptionForm.dosage}
                                            onChange={handlePrescriptionChange}
                                            placeholder="Example: 500 mg"
                                            required
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="frequency" className={labelClass}>
                                            Frequency *
                                        </label>
                                        <input
                                            id="frequency"
                                            name="frequency"
                                            value={prescriptionForm.frequency}
                                            onChange={handlePrescriptionChange}
                                            placeholder="Example: As prescribed"
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="duration" className={labelClass}>
                                        Duration *
                                    </label>
                                    <input
                                        id="duration"
                                        name="duration"
                                        value={prescriptionForm.duration}
                                        onChange={handlePrescriptionChange}
                                        placeholder="Example: 5 days"
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="instructions" className={labelClass}>
                                        Instructions
                                    </label>
                                    <textarea
                                        id="instructions"
                                        name="instructions"
                                        value={prescriptionForm.instructions}
                                        onChange={handlePrescriptionChange}
                                        placeholder="Additional instructions..."
                                        rows={3}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="prescribed_date" className={labelClass}>
                                        Prescription Date *
                                    </label>
                                    <input
                                        id="prescribed_date"
                                        name="prescribed_date"
                                        type="date"
                                        value={prescriptionForm.prescribed_date}
                                        onChange={handlePrescriptionChange}
                                        max={new Date().toISOString().slice(0, 10)}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={savingPrescription || patientsLoading || patients.length === 0}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {savingPrescription ? (
                                        <>
                                            <LoaderCircle className="animate-spin" size={18} />
                                            Saving Prescription...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save Prescription
                                        </>
                                    )}
                                </button>
                            </form>
                        </section>
                    </>
                )}

                {/* Feedback */}
                {patientError && (
                    <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                        Patient loading error: {patientError}
                    </p>
                )}

                {message && (
                    <p role="status" className="rounded-lg bg-sky-50 p-4 text-sm text-sky-700">
                        {message}
                    </p>
                )}

                <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
                    © 2026 CARECONNECT. Connecting Care. Saving Lives.
                </footer>
            </main>
        </div>
    );
}
