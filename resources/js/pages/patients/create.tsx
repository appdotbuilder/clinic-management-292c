import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

export default function CreatePatient() {
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        nik: '',
        date_of_birth: '',
        gender: '',
        address: '',
        phone_number: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/patients');
    };

    return (
        <AppShell>
            <Head title="Register New Patient" />
            
            <div className="p-6">
                <div className="mb-8">
                    <div className="flex items-center space-x-2 mb-4">
                        <Link href="/patients" className="text-blue-600 hover:text-blue-800">
                            ← Back to Patients
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        👤 Register New Patient
                    </h1>
                    <p className="text-gray-600">Add a new patient to the system</p>
                </div>

                <div className="max-w-2xl">
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.full_name}
                                    onChange={(e) => setData('full_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter patient's full name"
                                    required
                                />
                                {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        NIK (National Identity Number) *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nik}
                                        onChange={(e) => setData('nik', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="16 digits"
                                        maxLength={16}
                                        required
                                    />
                                    {errors.nik && <p className="mt-1 text-sm text-red-600">{errors.nik}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    {errors.date_of_birth && <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender *
                                    </label>
                                    <select
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., 081234567890"
                                        required
                                    />
                                    {errors.phone_number && <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address *
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter complete address"
                                    required
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                            </div>

                            <div className="bg-blue-50 p-4 rounded-md">
                                <div className="flex">
                                    <div className="text-blue-400 mr-3">
                                        ℹ️
                                    </div>
                                    <div className="text-blue-800 text-sm">
                                        <p className="font-medium">Patient Registration Information</p>
                                        <p className="mt-1">All fields marked with (*) are required. Please ensure the NIK is valid and unique.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? '⏳ Registering...' : '💾 Register Patient'}
                                </Button>
                                <Link href="/patients">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}