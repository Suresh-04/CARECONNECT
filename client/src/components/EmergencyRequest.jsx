
import { useState } from 'react';
import {
    AlertTriangle,
    MapPin,
    Phone,
    Send,
    LoaderCircle,
    CheckCircle
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';

export default function EmergencyRequest() {
    const { user, profile } = useAuth();

    const [form, setForm] = useState({
        emergency_type: '',
        description: '',
        location: '',
        contact_phone: '',
        priority: 'high'
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        if (!user || profile?.role !== 'patient') {
            setError('Only patient accounts can submit emergency requests.');
            return;
        }

        setLoading(true);

        const { error: submitError } = await supabase
            .from('emergency_requests')
            .insert({
                requester_id: user.id,
                emergency_type: form.emergency_type,
                description: form.description,
                location: form.location,
                contact_phone: form.contact_phone,
                priority: form.priority
            });

        setLoading(false);

        if (submitError) {
            setError(submitError.message);
            return;
        }

        setMessage('Emergency request submitted successfully!');

        setForm({
            emergency_type: '',
            description: '',
            location: '',
            contact_phone: '',
            priority: 'high'
        });
    };

    return (
        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-red-100 p-3 text-red-600">
                    <AlertTriangle size={24} />
                </div>

                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Emergency Assistance
                    </h2>
                    <p className="text-sm text-gray-500">
                        Submit an emergency assistance request.
                    </p>
                </div>
            </div>

            {message && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    <CheckCircle size={18} />
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Emergency Type
                    </label>
                    <select
                        name="emergency_type"
                        value={form.emergency_type}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 p-3"
                    >
                        <option value="">Select emergency type</option>
                        <option value="Medical Emergency">Medical Emergency</option>
                        <option value="Accident">Accident</option>
                        <option value="Ambulance Assistance">Ambulance Assistance</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows="3"
                        placeholder="Describe the emergency (test data only)"
                        className="w-full rounded-lg border border-gray-300 p-3"
                    />
                </div>

                <div>
                    <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MapPin size={16} /> Location
                    </label>
                    <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        required
                        placeholder="Enter location"
                        className="w-full rounded-lg border border-gray-300 p-3"
                    />
                </div>

                <div>
                    <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Phone size={16} /> Contact Phone
                    </label>
                    <input
                        name="contact_phone"
                        type="tel"
                        value={form.contact_phone}
                        onChange={handleChange}
                        required
                        placeholder="Enter test contact number"
                        className="w-full rounded-lg border border-gray-300 p-3"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Priority
                    </label>
                    <select
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 p-3"
                    >
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="animate-spin" size={18} />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Submit Emergency Request
                        </>
                    )}
                </button>
            </form>

            <p className="mt-4 text-xs text-gray-500">
                CARECONNECT is a portfolio prototype, not an emergency response service.
                For real emergencies in India, call 112 directly.
            </p>
        </section>
    );
}
