import Notifications from './Notifications';
import { useEffect, useState } from 'react';
import { UserRound, Pencil, Save, X, LoaderCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';

export default function PatientProfile() {
    const { user, profile, refreshProfile } = useAuth();

    const [editing, setEditing] = useState(false);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setFullName(profile?.full_name || '');
        setPhone(profile?.phone || '');
    }, [profile]);

    const handleSave = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        const cleanName = fullName.trim();
        const cleanPhone = phone.trim();

        if (!cleanName) {
            setError('Please enter your full name.');
            return;
        }

        if (cleanPhone && !/^[0-9+\-\s()]{7,20}$/.test(cleanPhone)) {
            setError('Please enter a valid phone number.');
            return;
        }

        if (!user?.id || !supabase) {
            setError('Your session is unavailable. Please sign in again.');
            return;
        }

        setSaving(true);

        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                full_name: cleanName,
                phone: cleanPhone || null
            })
            .eq('id', user.id);

        if (updateError) {
            setError(updateError.message);
        } else {
            await refreshProfile();
            setEditing(false);
            setMessage('Your profile was updated successfully.');
        }

        setSaving(false);
    };

    return (
        <section id="my-profile" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-sky-50 p-3 text-sky-600">
                        <UserRound size={23} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">My Profile</h2>
                        <p className="text-sm text-slate-500">View and manage your account details.</p>
                    </div>
                </div>

                {!editing && (
                    <button
                        type="button"
                        onClick={() => {
                            setMessage('');
                            setError('');
                            setEditing(true);
                        }}
                        className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                    >
                        <Pencil size={16} /> Edit Profile
                    </button>
                )}
            </div>

            {message && (
                <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    {message}
                </p>
            )}

            {error && (
                <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </p>
            )}

            {editing ? (
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="patient-full-name" className="mb-1 block text-sm font-medium text-slate-700">
                            Full Name
                        </label>
                        <input
                            id="patient-full-name"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            maxLength={100}
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        />
                    </div>

                    <div>
                        <label htmlFor="patient-phone" className="mb-1 block text-sm font-medium text-slate-700">
                            Phone Number
                        </label>
                        <input
                            id="patient-phone"
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            maxLength={20}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
                        >
                            {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>

                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => {
                                setFullName(profile?.full_name || '');
                                setPhone(profile?.phone || '');
                                setEditing(false);
                                setError('');
                            }}
                            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                        >
                            <X size={16} /> Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-slate-500">Full Name</p>
                        <p className="mt-1 font-medium text-slate-800">{profile?.full_name || 'Not provided'}</p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-slate-500">Phone Number</p>
                        <p className="mt-1 font-medium text-slate-800">{profile?.phone || 'Not provided'}</p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-slate-500">Email Address</p>
                        <p className="mt-1 break-all font-medium text-slate-800">{profile?.email || user?.email || 'Not provided'}</p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-slate-500">Account Role</p>
                        <p className="mt-1 font-medium capitalize text-slate-800">{profile?.role?.replaceAll('_', ' ') || 'Patient'}</p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase text-slate-500">Verification Status</p>
                        <p className="mt-1 font-medium capitalize text-slate-800">{profile?.verification_status || 'Not available'}</p>
                    </div>
                </div>
            )}
        </section>
    );
}

