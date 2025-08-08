import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from './AuthContext';
import type { UserRole } from '../../../server/src/schema';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, logout } = useAuth();

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'dokter':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'resepsionis':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'dokter':
        return '👨‍⚕️';
      case 'resepsionis':
        return '📋';
      default:
        return '👤';
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'dokter':
        return 'Doctor';
      case 'resepsionis':
        return 'Receptionist';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <span className="text-2xl">🏥</span>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                <p className="text-xs text-gray-500">Clinic Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <div className="flex items-center justify-end space-x-2">
                  <Badge className={getRoleBadgeColor(user!.role)}>
                    <span className="mr-1">{getRoleIcon(user!.role)}</span>
                    {getRoleDisplayName(user!.role)}
                  </Badge>
                  <span className="text-xs text-gray-500">@{user?.username}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p>© 2024 Clinic Management System</p>
            <p>
              Logged in as <strong>{user?.full_name}</strong> ({getRoleDisplayName(user!.role)})
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}