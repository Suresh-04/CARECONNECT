
import { useCallback, useEffect, useState } from 'react';
import {
    AlertTriangle,
    MapPin,
    CalendarDays,
    Clock,
    RefreshCw,
    LoaderCircle
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';

export default function EmergencyRequestHistory() {
    const { user } = useAuth();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchRequests = useCallback(async () => {
        if (!user) {
            setRequests([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');

        const { data, error: fetchError } = await supabase
            .from('emergency_requests')
            .select('*')
            .eq('requester_id', user.id)
            .order('created_at', { ascending: false });

        if (fetchError) {
            setError(fetchError.message);
        } else {
            setRequests(data || []);
        }

        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const statusStyle = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            accepted: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-purple-100 text-purple-800',
            resolved: 'bg-green-100 text-green-800',
            cancelled: 'bg-gray-100 text-gray-700'
        };

        return styles[status] || 'bg-gray-100 text-gray-700';
    };

    const formatStatus = (status) => {
        return status.replace('_', ' ').replace(/\b\w/g, char =>
            char.toUpperCase()
        );
    };

    return (
        <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-red-100 p-3 text-red-600">
                        <AlertTriangle size={23} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            My Emergency Requests
                        </h2>
                        <p className="text-sm text-gray-500">
                            View your submitted emergency requests and their status.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={fetchRequests}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {loading && (
                <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
                    <LoaderCircle className="animate-spin" size={20} />
                    Loading emergency requests...
                </div>
            )}

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {!loading && !error && requests.length === 0 && (
                <div className="rounded-xl bg-gray-50 py-8 text-center">
                    <AlertTriangle className="mx-auto mb-3 text-gray-400" size={32} />
                    <p className="font-medium text-gray-700">
                        No emergency requests found.
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Your submitted requests will appear here.
                    </p>
                </div>
            )}

            {!loading && !error && requests.length > 0 && (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className="rounded-xl border border-gray-200 p-4"
                        >
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <h3 className="font-semibold text-gray-900">
                                    {request.emergency_type}
                                </h3>

                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(request.status)}`}>
                                    {formatStatus(request.status)}
                                </span>
                            </div>

                            <p className="mb-3 text-sm text-gray-600">
                                {request.description}
                            </p>

                            <div className="grid gap-2 text-sm text-gray-500 sm:grid-cols-2">
                                <p className="flex items-center gap-2">
                                    <MapPin size={15} />
                                    {request.location}
                                </p>

                                <p className="flex items-center gap-2">
                                    <CalendarDays size={15} />
                                    {new Date(request.created_at).toLocaleString()}
                                </p>

                                <p className="flex items-center gap-2">
                                    <Clock size={15} />
                                    Priority: {request.priority}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
