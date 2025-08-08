import { type UserRole } from '../schema';
import { requireAuth, requireRole, type AuthContext } from './authorization';

export interface RequestContext {
  auth?: AuthContext | null;
}

export async function authMiddleware(sessionId: string | null): Promise<RequestContext> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this middleware is to:
    // 1. Extract session from request headers/cookies
    // 2. Validate session and get user context
    // 3. Add auth context to request context
    // 4. Return context for use in protected procedures
    
    const auth = await requireAuth(sessionId);
    
    return {
        auth
    };
}

export async function roleGuard(context: RequestContext, requiredRoles: UserRole[]): Promise<void> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this guard is to:
    // 1. Check if user is authenticated
    // 2. Check if user has required role
    // 3. Throw error if unauthorized
    
    if (!context.auth) {
        throw new Error('Authentication required');
    }
    
    const hasPermission = await requireRole(context.auth, requiredRoles);
    if (!hasPermission) {
        throw new Error('Insufficient permissions');
    }
}

export async function adminGuard(context: RequestContext): Promise<void> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this guard is to ensure only admin users can access certain endpoints
    
    await roleGuard(context, ['admin']);
}

export async function dokterGuard(context: RequestContext): Promise<void> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this guard is to ensure only doctors (and admins) can access certain endpoints
    
    await roleGuard(context, ['dokter', 'admin']);
}

export async function resepsionisGuard(context: RequestContext): Promise<void> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this guard is to ensure only receptionists (and admins) can access certain endpoints
    
    await roleGuard(context, ['resepsionis', 'admin']);
}

export async function authenticatedGuard(context: RequestContext): Promise<void> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this guard is to ensure user is authenticated (any role)
    
    if (!context.auth) {
        throw new Error('Authentication required');
    }
}