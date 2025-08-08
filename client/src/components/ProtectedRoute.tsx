import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoginForm } from './LoginForm';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from './AuthContext';
import type { UserRole } from '../../../server/src/schema';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <LoginForm />;
  }

  if (!allowedRoles.includes(user.role)) {
    const handleGoToDashboard = () => {
      const dashboardPath = 
        user.role === 'admin' ? '/admin/dashboard' :
        user.role === 'dokter' ? '/dokter/dashboard' :
        user.role === 'resepsionis' ? '/resepsionis/dashboard' :
        '/';
      
      window.location.href = dashboardPath;
    };

    return (
      <DashboardLayout title="Access Denied">
        <div className="max-w-md mx-auto mt-8">
          <Card className="border-red-200">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">🚫</div>
              <CardTitle className="text-red-800">Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-700 mb-2">
                  <strong>Your role:</strong> <Badge className="bg-red-100 text-red-800">{user.role}</Badge>
                </p>
                <p className="text-sm text-red-700">
                  <strong>Required roles:</strong> {allowedRoles.join(', ')}
                </p>
              </div>
              <Button onClick={handleGoToDashboard} className="w-full">
                Go to Your Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return <>{children}</>;
}