
import { useEffect, useState } from 'react';
import {
    Droplet,
    MapPin,
    CalendarDays,
    Save,
    LoaderCircle,
    CheckCircle
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';

const bloodGroups = [
    'A+', 'A-', 'B+', 'B-',
    'AB+', 'AB-', 'O+', 'O-'
];

export default function BloodDonorRegistration() {
    const { user, profile } = useAuth();

    const [form, setForm] = useState({
        blood_group: '',
        city: '',
        state: '',
        availability: true,
        last_donation_date: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [registered, setRegistered] = useState(false);

    useEffect(() => {
        const loadDonor = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            const { data, error: fetchError } = await supabase
                .from('blood_donors')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (fetchError) {
                setError(fetchError.message);
            } else if (data) {
                setForm({
                    blood_group: data.blood_group || '',
                    city: data.city || '',
                    state: data.state || '',
                    availability: data.availability,
                    last_donation_date: data.last_donation_date || ''
                });
                setRegistered(true);
            }

            setLoading(false);
        };

        loadDonor();
    }, [user?.id]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setMessage('');

        if (!user?.id || profile?.role !== 'blood_donor') {
            setError('Please log in using a blood donor account.');
            return;
        }

        setSaving(true);

        const donorData = {
            id: user.id,
            blood_group: form.blood_group,
            city: form.city.trim(),
            state: form.state.trim(),
            availability: form.availability,
            last_donation_date: form.last_donation_date || null,
            updated_at: new Date().toISOString()
        };

        const { error: saveError } = registered
            ? await supabase
                .from('blood_donors')
                .update(donorData)
                .eq('id', user.id)
            : await supabase
                .from('blood_donors')
                .insert(donorData);

        if (saveError) {
            setError(saveError.message);
        } else {
            setRegistered(true);
            setMessage('Blood donor profile saved successfully!');
        }

        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-2 py-10 text-slate-500">
                <LoaderCircle className="animate-spin" />
                Loading donor profile...
            </div>
        );
    }

    if (profile?.role !== 'blood_donor') {
        return (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                Please log in with a blood donor account to register as a donor.
            </div>
        );
    }

    const inputClass =
        'mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100';

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-red-50 p-3 text-red-600">
                    <Droplet size={26} />
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Blood Donor Registration
                    </h2>
                    <p className="text-sm text-slate-500">
                        Manage your blood donor information.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="text-sm font-semibold text-slate-700">
                        Blood Group
                    </label>

                    <select
                        name="blood_group"
                        value={form.blood_group}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    >
                        <option value="">Select blood group</option>

                        {bloodGroups.map((group) => (
                            <option key={group} value={group}>
                                {group}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <MapPin size={16} />
                            City
                        </label>

                        <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="Enter your city"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700">
                            State
                        </label>

                        <input
                            type="text"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            placeholder="Enter your state"
                            className={inputClass}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <CalendarDays size={16} />
                        Last Donation Date (Optional)
                    </label>

                    <input
                        type="date"
                        name="last_donation_date"
                        value={form.last_donation_date}
                        onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]}
                        className={inputClass}
                    />
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-slate-50 p-4">
                    <input
                        type="checkbox"
                        name="availability"
                        checked={form.availability}
                        onChange={handleChange}
                        className="h-4 w-4 accent-red-600"
                    />

                    <span className="text-sm font-medium text-slate-700">
                        I am currently available to be contacted for blood donation requests.
                    </span>
                </label>

                {error && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                {message && (
                    <p className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                        <CheckCircle size={18} />
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving ? (
                        <>
                            <LoaderCircle className="animate-spin" size={18} />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            {registered ? 'Update Donor Profile' : 'Register as Blood Donor'}
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
