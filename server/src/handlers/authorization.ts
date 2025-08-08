import { db } from '../db';
import { sessionsTable, usersTable } from '../db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { type UserRole } from '../schema';

export interface AuthContext {
  userId: number;
  userRole: UserRole;
  sessionId: string;
}

/**
 * Check if a user role has permission based on required roles
 * Admin role has access to everything (role hierarchy)
 */
export async function checkRolePermission(userRole: UserRole, requiredRoles: UserRole[]): Promise<boolean> {
    try {
        // Admin has access to everything
        if (userRole === 'admin') {
            return true;
        }
        
        // Check if user role is in required roles
        return requiredRoles.includes(userRole);
    } catch (error) {
        console.error('Role permission check failed:', error);
        return false;
    }
}

/**
 * Check if a user role can access a specific route
 * Uses predefined route permissions with role hierarchy
 */
export async function checkRouteAccess(userRole: UserRole, route: string): Promise<boolean> {
    try {
        // Define route access patterns based on user roles
        const routePermissions: Record<string, UserRole[]> = {
            '/admin/dashboard': ['admin'],
            '/admin/users': ['admin'],
            '/admin/settings': ['admin'],
            '/dokter/dashboard': ['dokter'],
            '/dokter/patients': ['dokter'],
            '/dokter/appointments': ['dokter'],
            '/resepsionis/dashboard': ['resepsionis'],
            '/resepsionis/appointments': ['resepsionis'],
            '/resepsionis/patients': ['resepsionis'],
            '/profile': ['admin', 'dokter', 'resepsionis'], // All roles can access profile
            '/logout': ['admin', 'dokter', 'resepsionis'] // All roles can logout
        };
        
        const allowedRoles = routePermissions[route];
        if (!allowedRoles) {
            // Route not defined, default to deny access
            return false;
        }
        
        return await checkRolePermission(userRole, allowedRoles);
    } catch (error) {
        console.error('Route access check failed:', error);
        return false;
    }
}

/**
 * Get the default dashboard route based on user role
 * Used for redirecting users after login
 */
export function getDefaultDashboardRoute(userRole: UserRole): string {
    const dashboardRoutes: Record<UserRole, string> = {
        'admin': '/admin/dashboard',
        'dokter': '/dokter/dashboard',
        'resepsionis': '/resepsionis/dashboard'
    };
    
    return dashboardRoutes[userRole] || '/';
}

/**
 * Validate session and return authentication context
 * Checks session validity and expiration
 */
export async function requireAuth(sessionId: string | null): Promise<AuthContext | null> {
    try {
        if (!sessionId) {
            return null;
        }
        
        // Query session with user data using join
        const results = await db.select({
            sessionId: sessionsTable.id,
            userId: sessionsTable.user_id,
            expiresAt: sessionsTable.expires_at,
            userRole: usersTable.role,
            isActive: usersTable.is_active
        })
        .from(sessionsTable)
        .innerJoin(usersTable, eq(sessionsTable.user_id, usersTable.id))
        .where(
            and(
                eq(sessionsTable.id, sessionId),
                gte(sessionsTable.expires_at, new Date()), // Session not expired
                eq(usersTable.is_active, true) // User is active
            )
        )
        .execute();
        
        if (results.length === 0) {
            return null; // Session not found, expired, or user inactive
        }
        
        const session = results[0];
        return {
            userId: session.userId,
            userRole: session.userRole,
            sessionId: session.sessionId
        };
    } catch (error) {
        console.error('Authentication check failed:', error);
        return null;
    }
}

/**
 * Check if authenticated user has required role
 * Combines authentication and authorization check
 */
export async function requireRole(authContext: AuthContext | null, requiredRoles: UserRole[]): Promise<boolean> {
    try {
        if (!authContext) {
            return false; // Not authenticated
        }
        
        return await checkRolePermission(authContext.userRole, requiredRoles);
    } catch (error) {
        console.error('Role requirement check failed:', error);
        return false;
    }
}

/**
 * Validate session and check role requirements in one call
 * Convenience function for middleware use
 */
export async function requireAuthAndRole(sessionId: string | null, requiredRoles: UserRole[]): Promise<AuthContext | null> {
    try {
        const authContext = await requireAuth(sessionId);
        if (!authContext) {
            return null;
        }
        
        const hasRole = await requireRole(authContext, requiredRoles);
        if (!hasRole) {
            return null;
        }
        
        return authContext;
    } catch (error) {
        console.error('Authentication and role check failed:', error);
        return null;
    }
}

/**
 * Check if user can perform specific action
 * More granular permission system
 */
export async function checkActionPermission(userRole: UserRole, action: string, resourceType?: string): Promise<boolean> {
    try {
        // Define action permissions
        const actionPermissions: Record<string, Record<string, UserRole[]>> = {
            'create': {
                'user': ['admin'],
                'appointment': ['resepsionis', 'admin'],
                'patient': ['dokter', 'resepsionis', 'admin']
            },
            'read': {
                'user': ['admin'],
                'appointment': ['dokter', 'resepsionis', 'admin'],
                'patient': ['dokter', 'resepsionis', 'admin']
            },
            'update': {
                'user': ['admin'],
                'appointment': ['resepsionis', 'admin'],
                'patient': ['dokter', 'resepsionis', 'admin']
            },
            'delete': {
                'user': ['admin'],
                'appointment': ['admin'],
                'patient': ['admin']
            }
        };
        
        if (!resourceType) {
            // No resource specified, check general action
            return userRole === 'admin';
        }
        
        const actionResource = actionPermissions[action]?.[resourceType];
        if (!actionResource) {
            // Action/resource combination not defined, default to admin only
            return userRole === 'admin';
        }
        
        return await checkRolePermission(userRole, actionResource);
    } catch (error) {
        console.error('Action permission check failed:', error);
        return false;
    }
}