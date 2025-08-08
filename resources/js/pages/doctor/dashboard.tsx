import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Stats {
    totalPatients: number;
    todayVisits: number;
}

interface Visit {
    id: number;
    visit_date: string;
    notes: string;
    patient: {
        id: number;
        full_name: string;
        nik: string;
    };
}

interface Props {
    stats: Stats;
    recentVisits: Visit[];
    [key: string]: unknown;
}

export default function DoctorDashboard({ stats, recentVisits }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppShell>
            <Head title="Doctor Dashboard" />
            
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        👨‍⚕️ Doctor Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage patient visits and prescriptions
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="text-2xl">🏥</div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.totalPatients}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="text-2xl">📅</div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Today's Visits</p>
                                <p className="text-2xl font-semibold text-blue-600">{stats.todayVisits}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Visits */}
                <div className="bg-white rounded-lg shadow mb-8 border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">📋 Recent Patient Visits</h3>
                    </div>
                    <div className="p-6">
                        {recentVisits.length > 0 ? (
                            <div className="space-y-4">
                                {recentVisits.map((visit) => (
                                    <div key={visit.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <h4 className="font-medium text-gray-900">{visit.patient.full_name}</h4>
                                                <span className="text-sm text-gray-500">NIK: {visit.patient.nik}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{formatDate(visit.visit_date)}</p>
                                            {visit.notes && (
                                                <p className="text-sm text-gray-700 mt-2">{visit.notes}</p>
                                            )}
                                        </div>
                                        <Link href={`/visits/${visit.id}`}>
                                            <Button size="sm" variant="outline">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-4">🏥</div>
                                <p className="text-gray-500">No recent visits found</p>
                                <p className="text-sm text-gray-400 mt-1">Start by recording a new patient visit</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/visits/create">
                            <Button className="w-full justify-start" variant="outline">
                                ➕ New Visit
                            </Button>
                        </Link>
                        <Link href="/visits">
                            <Button className="w-full justify-start" variant="outline">
                                📋 My Visits
                            </Button>
                        </Link>
                        <Link href="/patients">
                            <Button className="w-full justify-start" variant="outline">
                                🏥 View Patients
                            </Button>
                        </Link>
                        <Link href="/patients/create">
                            <Button className="w-full justify-start" variant="outline">
                                👤 Add Patient
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}