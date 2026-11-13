
import { useEffect, useState } from 'react';
import {
    FileText,
    CalendarDays,
    Stethoscope,
    LoaderCircle,
    ClipboardList
} from 'lucide-react';

import { supabase } from '../config/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function MedicalRecords() {
    const { user } = useAuth();

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadRecords = async () => {
            if (!user || !supabase) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('medical_records')
                .select('*')
                .eq('patient_id', user.id)
                .order('record_date', { ascending: false });

            if (error) {
                setError(error.message);
            } else {
                setRecords(data || []);
            }

            setLoading(false);
        };

        loadRecords();
    }, [user]);

    return (
        <section className="space-y-5">
            <div>
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                        <FileText size={25} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Medical Records
                        </h2>
                        <p className="text-sm text-slate-500">
                            Your medical history and treatment records.
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 rounded-xl bg-white p-6 text-slate-500">
                    <LoaderCircle size={20} className="animate-spin" />
                    Loading medical records...
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                    Unable to load records: {error}
                </div>
            ) : records.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                    <ClipboardList
                        size={40}
                        className="mx-auto text-slate-300"
                    />

                    <h3 className="mt-3 font-semibold text-slate-700">
                        No Medical Records Yet
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Your medical records will appear here when they are
                        added by an authorized healthcare provider.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {records.map((record) => (
                        <article
                            key={record.id}
                            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
                                        <Stethoscope size={22} />
                                    </div>

                                    <h3 className="font-bold text-slate-800">
                                        {record.record_title}
                                    </h3>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                <CalendarDays size={17} />
                                {new Date(
                                    `${record.record_date}T00:00:00`
                                ).toLocaleDateString()}
                            </div>

                            {record.diagnosis && (
                                <p className="mt-4 text-sm text-slate-600">
                                    <strong>Diagnosis:</strong> {record.diagnosis}
                                </p>
                            )}

                            {record.treatment && (
                                <p className="mt-2 text-sm text-slate-600">
                                    <strong>Treatment:</strong> {record.treatment}
                                </p>
                            )}

                            {record.notes && (
                                <p className="mt-2 text-sm text-slate-600">
                                    <strong>Notes:</strong> {record.notes}
                                </p>
                            )}

                            {record.report_url && (
                                <a
                                    href={record.report_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700"
                                >
                                    <FileText size={17} />
                                    View Medical Report
                                </a>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
