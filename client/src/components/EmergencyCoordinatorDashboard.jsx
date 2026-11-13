
import { useCallback, useEffect, useState } from 'react';
import {
    AlertTriangle,
    MapPin,
    Phone,
    Clock,
    RefreshCw,
    LoaderCircle,
    ClipboardList,
    CheckCircle,
    Activity,
    Radio
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';

const statusOptions = [
    'pending',
    'accepted',
    'in_progress',
    'resolved',
    'cancelled'
];

export default function EmergencyCoordinatorDashboard() {
    const { profile, signOut } = useAuth();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [realtimeConnected, setRealtimeConnected] = useState(false);

    const authorized =
        profile?.role === 'emergency_coordinator' ||
        profile?.role === 'super_admin';

    const fetchRequests = useCallback(async () => {
        if (!authorized) {
            setRequests([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');

        const { data, error: fetchError } = await supabase
            .from('emergency_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (fetchError) {
            setError(fetchError.message);
        } else {
            setRequests(data || []);
        }

        setLoading(false);
    }, [authorized]);

    useEffect(() => {
        if (!authorized) return;

        fetchRequests();

        const channel = supabase
            .channel('emergency-coordinator-live-requests')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'emergency_requests'
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setRequests((previous) => {
                            const exists = previous.some(
                                (item) => item.id === payload.new.id
                            );

                            if (exists) return previous;

                            return [payload.new, ...previous];
                        });

                        setMessage('New emergency request received.');
                    }

                    if (payload.eventType === 'UPDATE') {
                        setRequests((previous) =>
                            previous.map((item) =>
                                item.id === payload.new.id
                                    ? payload.new
                                    : item
                            )
                        );
                    }

                    if (payload.eventType === 'DELETE') {
                        setRequests((previous) =>
                            previous.filter(
                                (item) => item.id !== payload.old.id
                            )
                        );
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    setRealtimeConnected(true);
                } else if (
                    status === 'CHANNEL_ERROR' ||
                    status === 'TIMED_OUT' ||
                    status === 'CLOSED'
                ) {
                    setRealtimeConnected(false);
                }
            });

        return () => {
            supabase.removeChannel(channel);
            setRealtimeConnected(false);
        };
    }, [authorized, fetchRequests]);

    const updateStatus = async (requestId, newStatus) => {
        setUpdatingId(requestId);
        setError('');
        setMessage('');

        const { error: updateError } = await supabase
            .from('emergency_requests')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', requestId);

        setUpdatingId(null);

        if (updateError) {
            setError(updateError.message);
            return;
        }

        setMessage('Emergency request status updated successfully.');
        await fetchRequests();
    };

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

    const formatStatus = (status) =>
        status.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase());

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <AlertTriangle className="mx-auto mb-4 text-red-600" size={40} />
                    <h2 className="text-xl font-bold text-gray-900">
                        Access Restricted
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Only authorized emergency coordinators can access this dashboard.
                    </p>
                </div>
            </div>
        );
    }

    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const activeCount = requests.filter(
        r => ['accepted', 'in_progress'].includes(r.status)
    ).length;
    const resolvedCount = requests.filter(r => r.status === 'resolved').length;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-red-600 p-3 text-white">
                            <AlertTriangle size={25} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                CARECONNECT
                            </h1>
                            <p className="text-xs text-slate-500">
                                Emergency Coordinator Portal
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={signOut}
                        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-8 px-5 py-8">
                <section className="rounded-2xl bg-gradient-to-r from-red-700 to-orange-600 p-8 text-white shadow-lg">
                    <p className="text-sm font-medium text-red-100">
                        EMERGENCY MANAGEMENT
                    </p>
                    <h2 className="mt-3 text-3xl font-bold">
                        Emergency Control Center
                    </h2>
                    <p className="mt-2 text-sm text-red-100">
                        Monitor incoming requests and manage their statuses.
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm">
                        <Radio
                            size={17}
                            className={realtimeConnected ? 'text-green-300' : 'text-yellow-300'}
                        />
                        <span>
                            {realtimeConnected
                                ? 'Live updates connected'
                                : 'Connecting to live updates...'}
                        </span>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-3">
                    {[
                        {
                            title: 'Pending Requests',
                            count: pendingCount,
                            icon: ClipboardList,
                            color: 'text-yellow-600'
                        },
                        {
                            title: 'Active Requests',
                            count: activeCount,
                            icon: Activity,
                            color: 'text-blue-600'
                        },
                        {
                            title: 'Resolved Requests',
                            count: resolvedCount,
                            icon: CheckCircle,
                            color: 'text-green-600'
                        }
                    ].map(item => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-500">
                                        {item.title}
                                    </p>
                                    <Icon size={23} className={item.color} />
                                </div>
                                <p className="mt-3 text-3xl font-bold">
                                    {item.count}
                                </p>
                            </div>
                        );
                    })}
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="text-xl font-bold">
                                Incoming Emergency Requests
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Review requests and update their status.
                            </p>
                        </div>

                        <button
                            onClick={fetchRequests}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>

                    {message && (
                        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center gap-2 py-10 text-slate-500">
                            <LoaderCircle className="animate-spin" />
                            Loading requests...
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="py-10 text-center text-slate-500">
                            <ClipboardList className="mx-auto mb-3" size={38} />
                            <p className="font-semibold">
                                No emergency requests found.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {requests.map(request => (
                                <article
                                    key={request.id}
                                    className="rounded-xl border border-slate-200 p-5"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <h4 className="text-lg font-bold">
                                                {request.emergency_type}
                                            </h4>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {request.description}
                                            </p>
                                        </div>

                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(request.status)}`}>
                                            {formatStatus(request.status)}
                                        </span>
                                    </div>

                                    <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                                        <p className="flex items-center gap-2">
                                            <MapPin size={16} />
                                            {request.location}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Phone size={16} />
                                            {request.contact_phone}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Clock size={16} />
                                            {new Date(request.created_at).toLocaleString('en-IN')}
                                        </p>
                                        <p className="font-semibold">
                                            Priority: {request.priority.toUpperCase()}
                                        </p>
                                    </div>

                                    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                                        <label className="text-sm font-semibold text-slate-700">
                                            Update Status:
                                        </label>

                                        <select
                                            value={request.status}
                                            disabled={updatingId === request.id}
                                            onChange={(e) => updateStatus(request.id, e.target.value)}
                                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>
                                                    {formatStatus(status)}
                                                </option>
                                            ))}
                                        </select>

                                        {updatingId === request.id && (
                                            <LoaderCircle
                                                size={18}
                                                className="animate-spin text-sky-600"
                                            />
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-500">
                    CARECONNECT Emergency Management — Portfolio Prototype
                </footer>
            </main>
        </div>
    );
}
