import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        } | null;
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    return (
        <>
            <Head title="MediClinic - Medical Clinic Management System" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
                {/* Navigation */}
                <nav className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    🏥 MediClinic
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link href="/dashboard">
                                        <Button>
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="space-x-2">
                                        <Link href="/login">
                                            <Button variant="outline">
                                                Login
                                            </Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button>
                                                Register
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
                            🏥 <span className="text-blue-600">MediClinic</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Complete Medical Clinic Management System with Multi-Role Authentication
                        </p>
                        <div className="flex justify-center space-x-4 mb-12">
                            {!auth.user && (
                                <>
                                    <Link href="/login">
                                        <Button size="lg" className="px-8 py-3">
                                            🚀 Get Started
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button variant="outline" size="lg" className="px-8 py-3">
                                            📝 Sign Up
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        {/* Admin Features */}
                        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
                            <div className="text-center">
                                <div className="text-4xl mb-4">👨‍💼</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Admin Dashboard</h3>
                                <ul className="text-gray-600 space-y-2 text-left">
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">💊</span>
                                        Drug & Item Management
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">👥</span>
                                        User Management
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">📊</span>
                                        Sales Reports & Analytics
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-green-500 mr-2">🏆</span>
                                        Top Selling Products
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Doctor Features */}
                        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
                            <div className="text-center">
                                <div className="text-4xl mb-4">👨‍⚕️</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Doctor Dashboard</h3>
                                <ul className="text-gray-600 space-y-2 text-left">
                                    <li className="flex items-center">
                                        <span className="text-blue-500 mr-2">🏥</span>
                                        Patient Data Management
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-blue-500 mr-2">📋</span>
                                        Visit History Tracking
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-blue-500 mr-2">💉</span>
                                        Prescription Management
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-blue-500 mr-2">🔗</span>
                                        Auto-linked Sales
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Receptionist Features */}
                        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
                            <div className="text-center">
                                <div className="text-4xl mb-4">👩‍💻</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Receptionist Dashboard</h3>
                                <ul className="text-gray-600 space-y-2 text-left">
                                    <li className="flex items-center">
                                        <span className="text-purple-500 mr-2">📅</span>
                                        Doctor Schedule Management
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-purple-500 mr-2">🆕</span>
                                        Patient Registration
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-purple-500 mr-2">💰</span>
                                        Sales Transaction Processing
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-purple-500 mr-2">📦</span>
                                        Stock Management
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Core Features */}
                    <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white p-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-6">🚀 Core Features</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl mb-2">🔐</div>
                                    <h4 className="font-semibold">Multi-Role Auth</h4>
                                    <p className="text-sm opacity-90">Admin, Doctor, Receptionist</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-2">🏥</div>
                                    <h4 className="font-semibold">Patient Records</h4>
                                    <p className="text-sm opacity-90">Complete medical history</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-2">💊</div>
                                    <h4 className="font-semibold">Drug Inventory</h4>
                                    <p className="text-sm opacity-90">Stock & pricing management</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-2">💰</div>
                                    <h4 className="font-semibold">Sales System</h4>
                                    <p className="text-sm opacity-90">Automated transactions</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-16 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Ready to Modernize Your Clinic? 🎯
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Join thousands of healthcare providers who trust MediClinic for their daily operations.
                        </p>
                        {!auth.user && (
                            <div className="space-x-4">
                                <Link href="/register">
                                    <Button size="lg" className="px-8 py-4 text-lg">
                                        🎉 Start Free Trial
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                                        🔑 Sign In
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}