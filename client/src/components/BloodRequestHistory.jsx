import { useEffect, useState } from 'react';
import { Droplet, MapPin, CalendarDays, LoaderCircle } from 'lucide-react';
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';

const BloodRequestHistory = () => {
    const { profile } = useAuth();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            if (!profile?.id) return;

            setLoading(true);
            setError('');

            const { data, error } = await supabase
                .from('blood_requests')
                .select('*')
                .eq('requester_id', profile.id)
                .order('created_at', { ascending: false });

            if (error) {
                setError(error.message);
            } else {
                setRequests(data || []);
            }

            setLoading(false);
        };

        fetchRequests();
    }, [profile?.id]);

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        matching: 'bg-blue-100 text-blue-800',
        fulfilled: 'bg-green-100 text-green-800',
        cancelled: 'bg-gray-100 text-gray-700',
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 p-5">
                <LoaderCircle className="animate-spin" />
                Loading blood requests...
            </div>
        );
    }

    if (error) {
        return (
            <p className="rounded-lg bg-red-50 p-4 text-red-600">
                Unable to load requests: {error}
            </p>
        );
    }

    return (
        <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
                My Blood Requests
            </h2>

            {requests.length === 0 ? (
                <p className="rounded-xl bg-gray-50 p-5 text-gray-500">
                    You haven't submitted any blood requests yet.
                </p>
            ) : (
                requests.map((request) => (
                    <div
                        key={request.id}
                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Droplet className="text-red-500" />
                                <h3 className="font-bold text-gray-800">
                                    {request.blood_group} Blood
                                </h3>
                            </div>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[request.status] ||
                                    'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                {request.status}
                            </span>
                        </div>

                        <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                            <p>
                                <strong>Units:</strong> {request.units}
                            </p>

                            <p>
                                <strong>Hospital:</strong> {request.hospital_name}
                            </p>

                            <p className="flex items-center gap-2">
                                <MapPin size={16} />
                                {request.city}, {request.state}
                            </p>

                            <p className="flex items-center gap-2">
                                <CalendarDays size={16} />
                                Required by: {request.required_by}
                            </p>
                        </div>

                        {request.notes && (
                            <p className="mt-3 text-sm text-gray-500">
                                Notes: {request.notes}
                            </p>
                        )}
                    </div>
                ))
            )}
        </section>
    );
};

export default BloodRequestHistory;
