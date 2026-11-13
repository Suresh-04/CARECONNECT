
import { useEffect, useState } from 'react';
import {
    Droplet,
    MapPin,
    CalendarDays,
    LoaderCircle,
    Users,
    Search,
    RefreshCw
} from 'lucide-react';

import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';

const BloodRequestHistory = () => {
    const { profile } = useAuth();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [matchingCounts, setMatchingCounts] = useState({});
    const [matchingLoading, setMatchingLoading] = useState({});

    const fetchRequests = async () => {
        if (!profile?.id) {
            setRequests([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');

        const { data, error: fetchError } = await supabase
            .from('blood_requests')
            .select('*')
            .eq('requester_id', profile.id)
            .order('created_at', { ascending: false });

        if (fetchError) {
            setError(fetchError.message);
            setRequests([]);
        } else {
            setRequests(data || []);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, [profile?.id]);

    const findMatchingDonors = async (requestId) => {
        setMatchingLoading((previous) => ({
            ...previous,
            [requestId]: true
        }));

        setError('');

        const { data, error: matchError } = await supabase.rpc(
            'count_matching_blood_donors',
            {
                target_request_id: requestId
            }
        );

        if (matchError) {
            setError(matchError.message);
        } else {
            setMatchingCounts((previous) => ({
                ...previous,
                [requestId]: data
            }));
        }

        setMatchingLoading((previous) => ({
            ...previous,
            [requestId]: false
        }));
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        matching: 'bg-blue-100 text-blue-800',
        fulfilled: 'bg-green-100 text-green-800',
        cancelled: 'bg-gray-100 text-gray-700'
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 p-5">
                <LoaderCircle className="animate-spin" />
                Loading blood requests...
            </div>
        );
    }

    if (error && requests.length === 0) {
        return (
            <p className="rounded-lg bg-red-50 p-4 text-red-600">
                Unable to load requests: {error}
            </p>
        );
    }

    return (
        <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-gray-800">
                    My Blood Requests
                </h2>

                <button
                    onClick={fetchRequests}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </p>
            )}

            {requests.length === 0 ? (
                <p className="rounded-xl bg-gray-50 p-5 text-gray-500">
                    You haven't submitted any blood requests yet.
                </p>
            ) : (
                requests.map((request) => (
                    <article
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

                        {['pending', 'matching'].includes(request.status) && (
                            <div className="mt-5 border-t border-gray-100 pt-4">
                                <button
                                    onClick={() => findMatchingDonors(request.id)}
                                    disabled={matchingLoading[request.id]}
                                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    {matchingLoading[request.id] ? (
                                        <LoaderCircle size={17} className="animate-spin" />
                                    ) : (
                                        <Search size={17} />
                                    )}

                                    Find Matching Donors
                                </button>

                                {matchingCounts[request.id] !== undefined && (
                                    <div className="mt-4 rounded-lg bg-red-50 p-4">
                                        <div className="flex items-center gap-2 text-red-700">
                                            <Users size={20} />

                                            <span className="font-semibold">
                                                {matchingCounts[request.id]} matching donor(s) found
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs text-gray-600">
                                            Matches are based on blood group,
                                            city and state, and donor-reported
                                            availability. Donor eligibility and
                                            availability must be confirmed
                                            directly with the hospital.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </article>
                ))
            )}
        </section>
    );
};

export default BloodRequestHistory;
