import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DashboardLayout } from '../DashboardLayout';
import { trpc } from '@/utils/trpc';
import type { AdminDashboardData } from '../../../../server/src/schema';

export function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError(null);
        const data = await trpc.dashboard.admin.query();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Welcome, Administrator! 👑</h2>
          <p className="opacity-90">
            Manage your clinic's users, monitor system activity, and oversee all operations.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700">Total Users</CardDescription>
              <CardTitle className="text-3xl text-blue-900">
                {dashboardData?.totalUsers || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600">All system users</p>
              <div className="mt-2 text-xs text-blue-500">
                👥 Active accounts in the system
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-700">Doctors</CardDescription>
              <CardTitle className="text-3xl text-green-900">
                {dashboardData?.totalDoctors || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">Active doctors</p>
              <div className="mt-2 text-xs text-green-500">
                👨‍⚕️ Medical professionals
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-700">Receptionists</CardDescription>
              <CardTitle className="text-3xl text-purple-900">
                {dashboardData?.totalReceptionists || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-600">Active receptionists</p>
              <div className="mt-2 text-xs text-purple-500">
                📋 Front desk staff
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Users Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>Recent Users</span>
                </CardTitle>
                <CardDescription>Recently registered users in the system</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All Users
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {dashboardData?.recentUsers && dashboardData.recentUsers.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentUsers.map((user, index) => (
                  <div key={user.id}>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {user.role === 'admin' ? '👑' : 
                             user.role === 'dokter' ? '👨‍⚕️' : '📋'}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.full_name}</p>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'dokter' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {user.role === 'dokter' ? 'Doctor' : 
                           user.role === 'resepsionis' ? 'Receptionist' : 
                           'Admin'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {user.created_at.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {index < dashboardData.recentUsers.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">👥</div>
                <p className="text-gray-500">No recent users to display</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>⚡</span>
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex-col">
                <span className="text-lg mb-1">👥</span>
                <span className="text-xs">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <span className="text-lg mb-1">📊</span>
                <span className="text-xs">View Reports</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <span className="text-lg mb-1">⚙️</span>
                <span className="text-xs">System Settings</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <span className="text-lg mb-1">🔧</span>
                <span className="text-xs">Maintenance</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}