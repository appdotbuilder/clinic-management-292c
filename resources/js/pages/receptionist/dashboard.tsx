import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Stats {
    totalPatients: number;
    todayVisits: number;
}

interface Schedule {
    id: number;
    day: string;
    start_time: string;
    end_time: string;
    specialization: string;
    doctor: {
        id: number;
        name: string;
    };
}

interface Patient {
    id: number;
    full_name: string;
    nik: string;
    phone_number: string;
    created_at: string;
}

interface Props {
    stats: Stats;
    todaySchedules: Schedule[];
    recentPatients: Patient[];
    [key: string]: unknown;
}

export default function ReceptionistDashboard({ stats, todaySchedules, recentPatients }: Props) {
    const formatTime = (timeString: string) => {
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppShell>
            <Head title="Receptionist Dashboard" />
            
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        👩‍💻 Receptionist Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage patient registration and doctor schedules
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="text-2xl">👥</div>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Today's Doctor Schedule */}
                    <div className="bg-white rounded-lg shadow border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">📅 Today's Doctor Schedule</h3>
                        </div>
                        <div className="p-6">
                            {todaySchedules.length > 0 ? (
                                <div className="space-y-4">
                                    {todaySchedules.map((schedule) => (
                                        <div key={schedule.id} className="p-4 bg-blue-50 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{schedule.doctor.name}</h4>
                                                    <p className="text-sm text-blue-600">{schedule.specialization}</p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                                    </p>
                                                </div>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                    Available
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">📅</div>
                                    <p className="text-gray-500">No doctors scheduled today</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Patients */}
                    <div className="bg-white rounded-lg shadow border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">🆕 Recently Registered Patients</h3>
                        </div>
                        <div className="p-6">
                            {recentPatients.length > 0 ? (
                                <div className="space-y-4">
                                    {recentPatients.map((patient) => (
                                        <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{patient.full_name}</h4>
                                                <p className="text-sm text-gray-600">NIK: {patient.nik}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Registered: {formatDate(patient.created_at)}
                                                </p>
                                            </div>
                                            <Link href={`/patients/${patient.id}`}>
                                                <Button size="sm" variant="outline">
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">👥</div>
                                    <p className="text-gray-500">No recent patients</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/patients/create">
                            <Button className="w-full justify-start" variant="outline">
                                ➕ Register Patient
                            </Button>
                        </Link>
                        <Link href="/patients">
                            <Button className="w-full justify-start" variant="outline">
                                👥 View Patients
                            </Button>
                        </Link>
                        <Link href="/sales/create">
                            <Button className="w-full justify-start" variant="outline">
                                💰 New Sale
                            </Button>
                        </Link>
                        <Link href="/sales">
                            <Button className="w-full justify-start" variant="outline">
                                📊 Sales History
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}