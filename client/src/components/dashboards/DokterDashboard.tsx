import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '../DashboardLayout';
import { useAuth } from '../AuthContext';
import { trpc } from '@/utils/trpc';
import type { DokterDashboardData } from '../../../../server/src/schema';

export function DokterDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DokterDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;
      
      try {
        setError(null);
        const data = await trpc.dashboard.dokter.query(user.id);
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load doctor dashboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout title="Doctor Dashboard">
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
      <DashboardLayout title="Doctor Dashboard">
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
    <DashboardLayout title="Doctor Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">
            Welcome, {dashboardData?.doctorInfo.full_name}! 👨‍⚕️
          </h2>
          <p className="opacity-90">
            Ready to provide excellent care to your patients today.
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
              <p className="text-sm text-blue-600">Scheduled for today</p>
              <div className="mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-blue-600">
                    {dashboardData?.todayAppointments === 0 ? 'No appointments today' :
                     dashboardData?.todayAppointments === 1 ? '1 appointment remaining' :
                     `${dashboardData?.todayAppointments} appointments scheduled`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-700 flex items-center space-x-2">
                <span>👥</span>
                <span>Total Patients</span>
              </CardDescription>
              <CardTitle className="text-4xl text-green-900">
                {dashboardData?.totalPatients || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600">Under your care</p>
              <div className="mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">
                    Active patient records
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📋</span>
              <span>Today's Overview</span>
            </CardTitle>
            <CardDescription>Your schedule and patient care summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                  <span>📅</span>
                  <span>Today's Schedule</span>
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  You have {dashboardData?.todayAppointments || 0} appointments scheduled for today.
                </p>
                {dashboardData?.todayAppointments && dashboardData.todayAppointments > 0 ? (
                  <div className="space-y-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {dashboardData.todayAppointments} appointments
                    </Badge>
                    <div className="text-xs text-blue-600">
                      Next appointment in 15 minutes
                    </div>
                  </div>
                ) : (
                  <Badge variant="secondary">No appointments today</Badge>
                )}
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
                  <span>👥</span>
                  <span>Patient Care</span>
                </h3>
                <p className="text-green-700 text-sm mb-3">
                  You are currently caring for {dashboardData?.totalPatients || 0} patients.
                </p>
                <div className="space-y-2">
                  <Badge className="bg-green-100 text-green-800">
                    {dashboardData?.totalPatients || 0} active patients
                  </Badge>
                  <div className="text-xs text-green-600">
                    All patient records up to date
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
            <CardDescription>Common tasks for patient care</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex-col">
                <span className="text-lg mb-1">📅</span>
                <span className="text-xs">View Schedule</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <span className="text-lg mb-1">👥</span>
                <span className="text-xs">Patient Records</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <span className="text-lg mb-1">📝</span>
                <span className="text-xs">Write Prescription</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <span className="text-lg mb-1">🔍</span>
                <span className="text-xs">Medical History</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Info Card */}
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>👨‍⚕️</span>
              <span>Doctor Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-2xl">
                👨‍⚕️
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {dashboardData?.doctorInfo.full_name}
                </h3>
                <p className="text-gray-600">@{dashboardData?.doctorInfo.username}</p>
                <p className="text-sm text-gray-500">Medical Doctor - General Practice</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}