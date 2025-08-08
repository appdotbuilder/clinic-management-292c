import { type UserRole } from '../schema';
import { requireAuth, requireRole, type AuthContext } from './authorization';

export interface RequestContext {
  auth?: AuthContext | null;
}

export async function authMiddleware(sessionId: string | null): Promise<RequestContext> {
  try {
    // Extract session from request and validate it
    const auth = await requireAuth(sessionId);
    
    return {
      auth
    };
  } catch (error) {
    console.error('Auth middleware error:', error);
    // Return context with no auth if authentication fails
    return {
      auth: null
    };
  }
}

export async function roleGuard(context: RequestContext, requiredRoles: UserRole[]): Promise<void> {
  // Check if user is authenticated
  if (!context.auth) {
    throw new Error('Authentication required');
  }
  
  // Validate required roles array
  if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
    throw new Error('Invalid role requirements');
  }
  
  // Check if user has required role
  const hasPermission = await requireRole(context.auth, requiredRoles);
  if (!hasPermission) {
    throw new Error(`Access denied. Required roles: ${requiredRoles.join(', ')}. User role: ${context.auth.userRole}`);
  }
  
  // If we get here, access is granted - return normally (no throw, no return value)
}

export async function adminGuard(context: RequestContext): Promise<void> {
  try {
    await roleGuard(context, ['admin']);
  } catch (error) {
    console.error('Admin guard failed:', error);
    throw new Error('Administrator access required');
  }
}

export async function dokterGuard(context: RequestContext): Promise<void> {
  try {
    await roleGuard(context, ['dokter', 'admin']);
  } catch (error) {
    console.error('Doctor guard failed:', error);
    throw new Error('Doctor or administrator access required');
  }
}

export async function resepsionisGuard(context: RequestContext): Promise<void> {
  try {
    await roleGuard(context, ['resepsionis', 'admin']);
  } catch (error) {
    console.error('Receptionist guard failed:', error);
    throw new Error('Receptionist or administrator access required');
  }
}

export async function authenticatedGuard(context: RequestContext): Promise<void> {
  if (!context.auth) {
    throw new Error('Authentication required');
  }
  
  // Additional validation to ensure the auth context is complete
  if (!context.auth.userId || !context.auth.userRole || !context.auth.sessionId) {
    throw new Error('Invalid authentication context');
  }
  
  // If we get here, user is properly authenticated - return normally
}

// Utility function to check if context has valid auth
export function isAuthenticated(context: RequestContext): context is RequestContext & { auth: AuthContext } {
  return context.auth !== null && context.auth !== undefined;
}

// Utility function to get user role from context
export function getUserRole(context: RequestContext): UserRole | null {
  return context.auth?.userRole || null;
}

// Utility function to get user ID from context
export function getUserId(context: RequestContext): number | null {
  return context.auth?.userId || null;
}