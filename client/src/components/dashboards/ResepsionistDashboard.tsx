import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '../DashboardLayout';
import { useAuth } from '../AuthContext';
import { trpc } from '@/utils/trpc';
import type { ResepsionistDashboardData } from '../../../../server/src/schema';

export function ResepsionistDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<ResepsionistDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;
      
      try {
        setError(null);
        const data = await trpc.dashboard.resepsionis.query(user.id);
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load receptionist dashboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout title="Receptionist Dashboard">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Receptionist Dashboard">
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

  const getPriorityLevel = () => {
    const pending = dashboardData?.pendingAppointments || 0;
    if (pending === 0) return { level: 'low', color: 'green', text: 'All caught up!' };
    if (pending <= 3) return { level: 'medium', color: 'yellow', text: 'Some tasks pending' };
    return { level: 'high', color: 'red', text: 'High priority items' };
  };

  const priority = getPriorityLevel();

  return (
    <DashboardLayout title="Receptionist Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">
            Welcome, {dashboardData?.receptionistInfo.full_name}! 📋
          </h2>
          <p className="opacity-90">
            Ready to assist patients and manage appointments efficiently.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700 flex items-center space-x-2">
                <span>📅</span>
                <span>Today's Appointments</span>
              </CardDescription>
              <CardTitle className="text-4xl text-blue-900">
                {dashboardData?.todayAppointments || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600">All appointments today</p>
              <div className="mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-blue-600">
                    Across all doctors
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-${priority.color}-200 bg-gradient-to-br from-${priority.color}-50 to-${priority.color}-100`}>
            <CardHeader className="pb-3">
              <CardDescription className={`text-${priority.color}-700 flex items-center space-x-2`}>
                <span>⏳</span>
                <span>Pending Appointments</span>
              </CardDescription>
              <CardTitle className={`text-4xl text-${priority.color}-900`}>
                {dashboardData?.pendingAppointments || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm text-${priority.color}-600`}>Require attention</p>
              <div className="mt-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 bg-${priority.color}-500 rounded-full`}></div>
                  <span className={`text-xs text-${priority.color}-600`}>
                    {priority.text}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📊</span>
              <span>Today's Status</span>
            </CardTitle>
            <CardDescription>Front desk operations overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                  <span>📋</span>
                  <span>Today's Workload</span>
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  {dashboardData?.todayAppointments || 0} appointments scheduled for today across all doctors.
                </p>
                <div className="space-y-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {dashboardData?.todayAppointments || 0} total appointments
                  </Badge>
                  <div className="text-xs text-blue-600">
                    {dashboardData?.todayAppointments === 0 ? 'Light day ahead' :
                     dashboardData?.todayAppointments && dashboardData.todayAppointments > 20 ? 'Busy day ahead' :
                     'Normal workload'}
                  </div>
                </div>
              </div>

              <div className={`p-4 bg-${priority.color}-50 rounded-lg border-l-4 border-${priority.color}-500`}>
                <h3 className={`font-semibold text-${priority.color}-900 mb-2 flex items-center space-x-2`}>
                  <span>⏳</span>
                  <span>Pending Tasks</span>
                </h3>
                <p className={`text-${priority.color}-700 text-sm mb-3`}>
                  {dashboardData?.pendingAppointments || 0} appointments need your attention.
                </p>
                <div className="space-y-2">
                  <Badge className={`bg-${priority.color}-100 text-${priority.color}-800`}>
                    {priority.level === 'low' ? 'All Clear' :
                     priority.level === 'medium' ? 'Moderate Priority' :
                     'High Priority'}
                  </Badge>
                  <div className={`text-xs text-${priority.color}-600`}>
                    {dashboardData?.pendingAppointments === 0 ? 'Great job staying on top of things!' :
                     'Check-ins, confirmations, and scheduling'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>⚡</span>
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common front desk tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex-col">
                <span className="text-lg mb-1">📅</span>
                <span className="text-xs">Schedule Appointment</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <span className="text-lg mb-1">✅</span>
                <span className="text-xs">Patient Check-in</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <span className="text-lg mb-1">📞</span>
                <span className="text-xs">Call Patients</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <span className="text-lg mb-1">💳</span>
                <span className="text-xs">Process Payment</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Receptionist Info & Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📋</span>
                <span>Staff Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center text-2xl">
                  📋
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {dashboardData?.receptionistInfo.full_name}
                  </h3>
                  <p className="text-gray-600">@{dashboardData?.receptionistInfo.username}</p>
                  <p className="text-sm text-gray-500">Front Desk Receptionist</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📋</span>
                <span>Today's Priority</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboardData?.pendingAppointments && dashboardData.pendingAppointments > 0 ? (
                <>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-800">
                        Pending Confirmations
                      </span>
                      <Badge className="bg-orange-100 text-orange-800">
                        {dashboardData.pendingAppointments}
                      </Badge>
                    </div>
                    <p className="text-xs text-orange-600 mt-1">
                      Call patients to confirm appointments
                    </p>
                  </div>
                  <Button size="sm" className="w-full">
                    Review Pending Items
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="text-sm text-green-600 font-medium">All tasks completed!</p>
                  <p className="text-xs text-gray-500">Great job staying organized</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}