import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Stats {
    totalProducts: number;
    totalUsers: number;
    lowStockProducts: number;
    todaySales: string;
    weeklySales: string;
    monthlySales: string;
}

interface TopProduct {
    name: string;
    total_sold: number;
    total_revenue: string;
}

interface Props {
    stats: Stats;
    topProducts: TopProduct[];
    [key: string]: unknown;
}

export default function AdminDashboard({ stats, topProducts }: Props) {
    return (
        <AppShell>
            <Head title="Admin Dashboard" />
            
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        👨‍💼 Admin Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage your clinic operations and view analytics
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="text-2xl">💊</div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Products</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="text-2xl">👥</div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="text-2xl">⚠️</div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                                <p className="text-2xl font-semibold text-red-600">{stats.lowStockProducts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="text-2xl">💰</div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                                <p className="text-2xl font-semibold text-green-600">Rp {parseFloat(stats.todaySales).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sales Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Sales Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Weekly Sales</span>
                                <span className="font-semibold text-blue-600">Rp {parseFloat(stats.weeklySales).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Monthly Sales</span>
                                <span className="font-semibold text-green-600">Rp {parseFloat(stats.monthlySales).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Top Products This Month</h3>
                        <div className="space-y-3">
                            {topProducts.slice(0, 5).map((product, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <p className="text-sm text-gray-600">{product.total_sold} sold</p>
                                    </div>
                                    <span className="font-semibold text-green-600">
                                        Rp {parseFloat(product.total_revenue).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            ))}
                            {topProducts.length === 0 && (
                                <p className="text-gray-500 italic">No sales data available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/products">
                            <Button className="w-full justify-start" variant="outline">
                                💊 Manage Products
                            </Button>
                        </Link>
                        <Link href="/products/create">
                            <Button className="w-full justify-start" variant="outline">
                                ➕ Add Product
                            </Button>
                        </Link>
                        <Link href="/sales">
                            <Button className="w-full justify-start" variant="outline">
                                💰 View Sales
                            </Button>
                        </Link>
                        <Link href="/patients">
                            <Button className="w-full justify-start" variant="outline">
                                🏥 View Patients
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}