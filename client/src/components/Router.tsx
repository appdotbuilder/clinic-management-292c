import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { LoginForm } from './LoginForm';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { DokterDashboard } from './dashboards/DokterDashboard';
import { ResepsionistDashboard } from './dashboards/ResepsionistDashboard';

export function Router() {
  const { user, isAuthenticated, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user && currentPath === '/') {
      const redirectPath = 
        user.role === 'admin' ? '/admin/dashboard' :
        user.role === 'dokter' ? '/dokter/dashboard' :
        user.role === 'resepsionis' ? '/resepsionis/dashboard' :
        '/';
      
      if (redirectPath !== '/') {
        window.history.pushState({}, '', redirectPath);
        setCurrentPath(redirectPath);
      }
    }
  }, [isAuthenticated, user, currentPath]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🏥</div>
          <p className="text-gray-600">Loading Clinic Management System...</p>
          <div className="mt-4">
            <div className="animate-pulse flex space-x-1 justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  switch (currentPath) {
    case '/admin/dashboard':
      return (
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      );
    case '/dokter/dashboard':
      return (
        <ProtectedRoute allowedRoles={['dokter']}>
          <DokterDashboard />
        </ProtectedRoute>
      );
    case '/resepsionis/dashboard':
      return (
        <ProtectedRoute allowedRoles={['resepsionis']}>
          <ResepsionistDashboard />
        </ProtectedRoute>
      );
    default:
      // Redirect to appropriate dashboard
      if (user) {
        const redirectPath = 
          user.role === 'admin' ? '/admin/dashboard' :
          user.role === 'dokter' ? '/dokter/dashboard' :
          user.role === 'resepsionis' ? '/resepsionis/dashboard' :
          '/';
        
        window.history.pushState({}, '', redirectPath);
        setCurrentPath(redirectPath);
      }
      return <LoginForm />;
  }
}