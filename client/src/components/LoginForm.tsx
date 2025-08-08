import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from './AuthContext';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: string) => {
    setUsername(role);
    setPassword('password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-4xl">🏥</div>
          <CardTitle className="text-2xl font-bold text-gray-900">Clinic Management</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="font-semibold mb-2">Quick Login (Demo):</p>
              <div className="space-y-2">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left p-2 h-auto"
                  onClick={() => handleQuickLogin('admin')}
                  disabled={isLoading}
                >
                  <span className="mr-2">👑</span>
                  <div>
                    <div className="font-medium">Admin Dashboard</div>
                    <div className="text-xs text-gray-500">admin / password</div>
                  </div>
                </Button>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left p-2 h-auto"
                  onClick={() => handleQuickLogin('dokter')}
                  disabled={isLoading}
                >
                  <span className="mr-2">👨‍⚕️</span>
                  <div>
                    <div className="font-medium">Doctor Dashboard</div>
                    <div className="text-xs text-gray-500">dokter / password</div>
                  </div>
                </Button>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-left p-2 h-auto"
                  onClick={() => handleQuickLogin('resepsionis')}
                  disabled={isLoading}
                >
                  <span className="mr-2">📋</span>
                  <div>
                    <div className="font-medium">Receptionist Dashboard</div>
                    <div className="text-xs text-gray-500">resepsionis / password</div>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}