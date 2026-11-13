
import { useCallback, useEffect, useState } from 'react';
import {
    Bell,
    CheckCheck,
    RefreshCw,
    LoaderCircle
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';

export default function Notifications() {
    const { user } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchNotifications = useCallback(async () => {
        if (!user?.id) return;

        setLoading(true);
        setError('');

        const { data, error: fetchError } = await supabase
            .from('notifications')
            .select('*')
            .eq('recipient_id', user.id)
            .order('created_at', { ascending: false });

        if (fetchError) {
            setError(fetchError.message);
        } else {
            setNotifications(data || []);
        }

        setLoading(false);
    }, [user?.id]);

    useEffect(() => {
        if (!user?.id) return;

        fetchNotifications();

        const channel = supabase
            .channel(`notifications-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `recipient_id=eq.${user.id}`
                },
                (payload) => {
                    setNotifications((previous) => {
                        if (previous.some((item) => item.id === payload.new.id)) {
                            return previous;
                        }

                        return [payload.new, ...previous];
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'notifications',
                    filter: `recipient_id=eq.${user.id}`
                },
                (payload) => {
                    setNotifications((previous) =>
                        previous.map((item) =>
                            item.id === payload.new.id
                                ? payload.new
                                : item
                        )
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id, fetchNotifications]);

    const markAsRead = async (notificationId) => {
        const { error: updateError } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId)
            .eq('recipient_id', user.id);

        if (updateError) {
            setError(updateError.message);
            return;
        }

        setNotifications((previous) =>
            previous.map((item) =>
                item.id === notificationId
                    ? { ...item, is_read: true }
                    : item
            )
        );
    };

    const unreadCount = notifications.filter(
        (item) => !item.is_read
    ).length;

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        My Notifications
                    </h2>
                    <p className="text-sm text-gray-500">
                        View your latest CARECONNECT updates.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                        {unreadCount} unread
                    </span>

                    <button
                        onClick={fetchNotifications}
                        className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </p>
            )}

            {loading ? (
                <div className="flex items-center gap-2 text-gray-500">
                    <LoaderCircle className="animate-spin" size={18} />
                    Loading notifications...
                </div>
            ) : notifications.length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center">
                    <Bell className="mx-auto mb-3 text-gray-400" size={32} />
                    <p className="font-medium text-gray-700">
                        No notifications yet.
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        New updates will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`rounded-xl border p-4 ${notification.is_read
                                    ? 'bg-white'
                                    : 'border-blue-200 bg-blue-50'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-blue-100 p-2 text-blue-700">
                                    <Bell size={18} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h3 className="font-semibold text-gray-900">
                                            {notification.title}
                                        </h3>

                                        {!notification.is_read && (
                                            <button
                                                onClick={() =>
                                                    markAsRead(notification.id)
                                                }
                                                className="flex items-center gap-1 text-sm text-blue-700 hover:underline"
                                            >
                                                <CheckCheck size={16} />
                                                Mark as read
                                            </button>
                                        )}
                                    </div>

                                    <p className="mt-1 text-sm text-gray-600">
                                        {notification.message}
                                    </p>

                                    <p className="mt-2 text-xs text-gray-400">
                                        {new Date(
                                            notification.created_at
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
