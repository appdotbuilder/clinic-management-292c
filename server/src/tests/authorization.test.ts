import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { usersTable, sessionsTable } from '../db/schema';
import { type UserRole, type CreateUserInput } from '../schema';
import {
  checkRolePermission,
  checkRouteAccess,
  getDefaultDashboardRoute,
  requireAuth,
  requireRole,
  requireAuthAndRole,
  checkActionPermission,
  type AuthContext
} from '../handlers/authorization';

// Test user data for different roles
const testUsers: CreateUserInput[] = [
  {
    username: 'admin_user',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
    full_name: 'Admin User',
    is_active: true
  },
  {
    username: 'dokter_user',
    email: 'dokter@test.com',
    password: 'password123',
    role: 'dokter',
    full_name: 'Doctor User',
    is_active: true
  },
  {
    username: 'resepsionis_user',
    email: 'resepsionis@test.com',
    password: 'password123',
    role: 'resepsionis',
    full_name: 'Receptionist User',
    is_active: true
  },
  {
    username: 'inactive_user',
    email: 'inactive@test.com',
    password: 'password123',
    role: 'dokter',
    full_name: 'Inactive User',
    is_active: false
  }
];

describe('authorization', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  describe('checkRolePermission', () => {
    it('should allow admin to access everything', async () => {
      const result = await checkRolePermission('admin', ['dokter']);
      expect(result).toBe(true);
    });

    it('should allow user with matching role', async () => {
      const result = await checkRolePermission('dokter', ['dokter', 'resepsionis']);
      expect(result).toBe(true);
    });

    it('should deny user without matching role', async () => {
      const result = await checkRolePermission('resepsionis', ['dokter']);
      expect(result).toBe(false);
    });

    it('should allow user with multiple valid roles', async () => {
      const result = await checkRolePermission('dokter', ['admin', 'dokter', 'resepsionis']);
      expect(result).toBe(true);
    });
  });

  describe('checkRouteAccess', () => {
    it('should allow admin to access admin routes', async () => {
      const result = await checkRouteAccess('admin', '/admin/dashboard');
      expect(result).toBe(true);
    });

    it('should allow dokter to access dokter routes', async () => {
      const result = await checkRouteAccess('dokter', '/dokter/dashboard');
      expect(result).toBe(true);
    });

    it('should allow resepsionis to access resepsionis routes', async () => {
      const result = await checkRouteAccess('resepsionis', '/resepsionis/dashboard');
      expect(result).toBe(true);
    });

    it('should deny dokter access to admin routes', async () => {
      const result = await checkRouteAccess('dokter', '/admin/dashboard');
      expect(result).toBe(false);
    });

    it('should deny access to undefined routes', async () => {
      const result = await checkRouteAccess('admin', '/nonexistent/route');
      expect(result).toBe(false);
    });

    it('should allow all roles to access profile', async () => {
      const adminResult = await checkRouteAccess('admin', '/profile');
      const dokterResult = await checkRouteAccess('dokter', '/profile');
      const resepsionisResult = await checkRouteAccess('resepsionis', '/profile');
      
      expect(adminResult).toBe(true);
      expect(dokterResult).toBe(true);
      expect(resepsionisResult).toBe(true);
    });

    it('should allow admin access to all role-specific routes', async () => {
      const adminToAdmin = await checkRouteAccess('admin', '/admin/dashboard');
      const adminToDokter = await checkRouteAccess('admin', '/dokter/dashboard');
      const adminToResepsionis = await checkRouteAccess('admin', '/resepsionis/dashboard');
      
      expect(adminToAdmin).toBe(true);
      expect(adminToDokter).toBe(true);
      expect(adminToResepsionis).toBe(true);
    });
  });

  describe('getDefaultDashboardRoute', () => {
    it('should return correct route for admin', () => {
      const result = getDefaultDashboardRoute('admin');
      expect(result).toBe('/admin/dashboard');
    });

    it('should return correct route for dokter', () => {
      const result = getDefaultDashboardRoute('dokter');
      expect(result).toBe('/dokter/dashboard');
    });

    it('should return correct route for resepsionis', () => {
      const result = getDefaultDashboardRoute('resepsionis');
      expect(result).toBe('/resepsionis/dashboard');
    });
  });

  describe('requireAuth', () => {
    let userId: number;
    let validSessionId: string;

    beforeEach(async () => {
      // Create test user
      const userResult = await db.insert(usersTable)
        .values({
          username: testUsers[0].username,
          email: testUsers[0].email,
          password_hash: 'hashed_password',
          role: testUsers[0].role,
          full_name: testUsers[0].full_name,
          is_active: testUsers[0].is_active
        })
        .returning()
        .execute();
      
      userId = userResult[0].id;

      // Create valid session
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);
      
      validSessionId = 'session_' + Math.random().toString(36).substr(2, 9);
      
      await db.insert(sessionsTable)
        .values({
          id: validSessionId,
          user_id: userId,
          expires_at: futureDate
        })
        .execute();
    });

    it('should return null for null session', async () => {
      const result = await requireAuth(null);
      expect(result).toBeNull();
    });

    it('should return null for invalid session', async () => {
      const result = await requireAuth('invalid_session');
      expect(result).toBeNull();
    });

    it('should return auth context for valid session', async () => {
      const result = await requireAuth(validSessionId);
      
      expect(result).not.toBeNull();
      expect(result!.userId).toBe(userId);
      expect(result!.userRole).toBe('admin');
      expect(result!.sessionId).toBe(validSessionId);
    });

    it('should return null for expired session', async () => {
      // Create expired session
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);
      
      const expiredSessionId = 'expired_session_' + Math.random().toString(36).substr(2, 9);
      
      await db.insert(sessionsTable)
        .values({
          id: expiredSessionId,
          user_id: userId,
          expires_at: pastDate
        })
        .execute();

      const result = await requireAuth(expiredSessionId);
      expect(result).toBeNull();
    });

    it('should return null for inactive user', async () => {
      // Create inactive user
      const inactiveUserResult = await db.insert(usersTable)
        .values({
          username: testUsers[3].username,
          email: testUsers[3].email,
          password_hash: 'hashed_password',
          role: testUsers[3].role,
          full_name: testUsers[3].full_name,
          is_active: testUsers[3].is_active
        })
        .returning()
        .execute();

      const inactiveUserId = inactiveUserResult[0].id;

      // Create session for inactive user
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);
      
      const inactiveSessionId = 'inactive_session_' + Math.random().toString(36).substr(2, 9);
      
      await db.insert(sessionsTable)
        .values({
          id: inactiveSessionId,
          user_id: inactiveUserId,
          expires_at: futureDate
        })
        .execute();

      const result = await requireAuth(inactiveSessionId);
      expect(result).toBeNull();
    });
  });

  describe('requireRole', () => {
    const authContext: AuthContext = {
      userId: 1,
      userRole: 'dokter',
      sessionId: 'test_session'
    };

    it('should return false for null auth context', async () => {
      const result = await requireRole(null, ['dokter']);
      expect(result).toBe(false);
    });

    it('should return true for matching role', async () => {
      const result = await requireRole(authContext, ['dokter']);
      expect(result).toBe(true);
    });

    it('should return false for non-matching role', async () => {
      const result = await requireRole(authContext, ['admin']);
      expect(result).toBe(false);
    });

    it('should return true for admin context with any required roles', async () => {
      const adminContext: AuthContext = {
        ...authContext,
        userRole: 'admin'
      };
      
      const result = await requireRole(adminContext, ['dokter']);
      expect(result).toBe(true);
    });
  });

  describe('requireAuthAndRole', () => {
    let userId: number;
    let validSessionId: string;

    beforeEach(async () => {
      // Create test user
      const userResult = await db.insert(usersTable)
        .values({
          username: testUsers[1].username,
          email: testUsers[1].email,
          password_hash: 'hashed_password',
          role: testUsers[1].role,
          full_name: testUsers[1].full_name,
          is_active: testUsers[1].is_active
        })
        .returning()
        .execute();
      
      userId = userResult[0].id;

      // Create valid session
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);
      
      validSessionId = 'session_' + Math.random().toString(36).substr(2, 9);
      
      await db.insert(sessionsTable)
        .values({
          id: validSessionId,
          user_id: userId,
          expires_at: futureDate
        })
        .execute();
    });

    it('should return null for invalid session', async () => {
      const result = await requireAuthAndRole('invalid_session', ['dokter']);
      expect(result).toBeNull();
    });

    it('should return null for valid session but wrong role', async () => {
      const result = await requireAuthAndRole(validSessionId, ['admin']);
      expect(result).toBeNull();
    });

    it('should return auth context for valid session and correct role', async () => {
      const result = await requireAuthAndRole(validSessionId, ['dokter']);
      
      expect(result).not.toBeNull();
      expect(result!.userId).toBe(userId);
      expect(result!.userRole).toBe('dokter');
      expect(result!.sessionId).toBe(validSessionId);
    });
  });

  describe('checkActionPermission', () => {
    it('should allow admin all actions', async () => {
      const createUser = await checkActionPermission('admin', 'create', 'user');
      const deleteAppointment = await checkActionPermission('admin', 'delete', 'appointment');
      
      expect(createUser).toBe(true);
      expect(deleteAppointment).toBe(true);
    });

    it('should allow dokter to read and update patients', async () => {
      const readPatient = await checkActionPermission('dokter', 'read', 'patient');
      const updatePatient = await checkActionPermission('dokter', 'update', 'patient');
      
      expect(readPatient).toBe(true);
      expect(updatePatient).toBe(true);
    });

    it('should deny dokter from creating users', async () => {
      const createUser = await checkActionPermission('dokter', 'create', 'user');
      expect(createUser).toBe(false);
    });

    it('should allow resepsionis to create appointments', async () => {
      const createAppointment = await checkActionPermission('resepsionis', 'create', 'appointment');
      expect(createAppointment).toBe(true);
    });

    it('should deny resepsionis from deleting patients', async () => {
      const deletePatient = await checkActionPermission('resepsionis', 'delete', 'patient');
      expect(deletePatient).toBe(false);
    });

    it('should default to admin-only for undefined actions', async () => {
      const unknownAction = await checkActionPermission('dokter', 'unknown', 'resource');
      const adminUnknownAction = await checkActionPermission('admin', 'unknown', 'resource');
      
      expect(unknownAction).toBe(false);
      expect(adminUnknownAction).toBe(true);
    });

    it('should default to admin-only for no resource specified', async () => {
      const noResource = await checkActionPermission('dokter', 'create');
      const adminNoResource = await checkActionPermission('admin', 'create');
      
      expect(noResource).toBe(false);
      expect(adminNoResource).toBe(true);
    });
  });
});