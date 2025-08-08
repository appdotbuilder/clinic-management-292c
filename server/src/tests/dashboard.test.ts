import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { getAdminDashboard, getDokterDashboard, getResepsionistDashboard, getDashboardByRole } from '../handlers/dashboard';

describe('Dashboard Handlers', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  describe('getAdminDashboard', () => {
    it('should return admin dashboard with correct counts', async () => {
      // Create test users with different roles
      await db.insert(usersTable).values([
        {
          username: 'admin1',
          email: 'admin1@test.com',
          password_hash: 'hash1',
          role: 'admin',
          full_name: 'Admin One',
          is_active: true
        },
        {
          username: 'dokter1',
          email: 'dokter1@test.com',
          password_hash: 'hash2',
          role: 'dokter',
          full_name: 'Dr. One',
          is_active: true
        },
        {
          username: 'dokter2',
          email: 'dokter2@test.com',
          password_hash: 'hash3',
          role: 'dokter',
          full_name: 'Dr. Two',
          is_active: true
        },
        {
          username: 'resepsionis1',
          email: 'resepsionis1@test.com',
          password_hash: 'hash4',
          role: 'resepsionis',
          full_name: 'Receptionist One',
          is_active: true
        },
        {
          username: 'inactive_user',
          email: 'inactive@test.com',
          password_hash: 'hash5',
          role: 'dokter',
          full_name: 'Inactive Doctor',
          is_active: false
        }
      ]).execute();

      const result = await getAdminDashboard();

      // Check counts (should only include active users)
      expect(result.totalUsers).toBe(4); // Only active users
      expect(result.totalDoctors).toBe(2); // Only active doctors
      expect(result.totalReceptionists).toBe(1);
      
      // Check recent users structure
      expect(result.recentUsers).toBeArray();
      expect(result.recentUsers.length).toBeLessThanOrEqual(5);
      
      // Verify recent users have correct properties
      result.recentUsers.forEach(user => {
        expect(user.id).toBeNumber();
        expect(user.username).toBeString();
        expect(user.role).toBeOneOf(['admin', 'dokter', 'resepsionis']);
        expect(user.full_name).toBeString();
        expect(user.created_at).toBeInstanceOf(Date);
      });
    });

    it('should return empty dashboard when no users exist', async () => {
      const result = await getAdminDashboard();

      expect(result.totalUsers).toBe(0);
      expect(result.totalDoctors).toBe(0);
      expect(result.totalReceptionists).toBe(0);
      expect(result.recentUsers).toEqual([]);
    });

    it('should order recent users by creation date descending', async () => {
      // Create users with slight delay to ensure different timestamps
      await db.insert(usersTable).values({
        username: 'user1',
        email: 'user1@test.com',
        password_hash: 'hash1',
        role: 'admin',
        full_name: 'User One',
        is_active: true
      }).execute();

      // Wait a bit to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));

      await db.insert(usersTable).values({
        username: 'user2',
        email: 'user2@test.com',
        password_hash: 'hash2',
        role: 'dokter',
        full_name: 'User Two',
        is_active: true
      }).execute();

      const result = await getAdminDashboard();

      expect(result.recentUsers.length).toBe(2);
      // Most recent user should be first
      expect(result.recentUsers[0].username).toBe('user2');
      expect(result.recentUsers[1].username).toBe('user1');
    });
  });

  describe('getDokterDashboard', () => {
    it('should return dokter dashboard with user info', async () => {
      // Create a dokter user
      const userResult = await db.insert(usersTable).values({
        username: 'dokter_test',
        email: 'dokter@test.com',
        password_hash: 'hash',
        role: 'dokter',
        full_name: 'Dr. Test',
        is_active: true
      }).returning().execute();

      const userId = userResult[0].id;
      const result = await getDokterDashboard(userId);

      expect(result.todayAppointments).toBe(0); // Mock data
      expect(result.totalPatients).toBe(0); // Mock data
      expect(result.doctorInfo.id).toBe(userId);
      expect(result.doctorInfo.username).toBe('dokter_test');
      expect(result.doctorInfo.full_name).toBe('Dr. Test');
    });

    it('should throw error when dokter not found', async () => {
      const nonExistentUserId = 999;
      
      await expect(getDokterDashboard(nonExistentUserId)).rejects.toThrow(/Doctor not found/i);
    });
  });

  describe('getResepsionistDashboard', () => {
    it('should return resepsionist dashboard with user info', async () => {
      // Create a resepsionist user
      const userResult = await db.insert(usersTable).values({
        username: 'resepsionis_test',
        email: 'resepsionis@test.com',
        password_hash: 'hash',
        role: 'resepsionis',
        full_name: 'Receptionist Test',
        is_active: true
      }).returning().execute();

      const userId = userResult[0].id;
      const result = await getResepsionistDashboard(userId);

      expect(result.todayAppointments).toBe(0); // Mock data
      expect(result.pendingAppointments).toBe(0); // Mock data
      expect(result.receptionistInfo.id).toBe(userId);
      expect(result.receptionistInfo.username).toBe('resepsionis_test');
      expect(result.receptionistInfo.full_name).toBe('Receptionist Test');
    });

    it('should throw error when resepsionist not found', async () => {
      const nonExistentUserId = 999;
      
      await expect(getResepsionistDashboard(nonExistentUserId)).rejects.toThrow(/Receptionist not found/i);
    });
  });

  describe('getDashboardByRole', () => {
    it('should return admin dashboard for admin role', async () => {
      // Create an admin user
      const userResult = await db.insert(usersTable).values({
        username: 'admin_test',
        email: 'admin@test.com',
        password_hash: 'hash',
        role: 'admin',
        full_name: 'Admin Test',
        is_active: true
      }).returning().execute();

      const userId = userResult[0].id;
      const result = await getDashboardByRole(userId, 'admin');

      // Should return AdminDashboardData structure
      expect(result).toHaveProperty('totalUsers');
      expect(result).toHaveProperty('totalDoctors');
      expect(result).toHaveProperty('totalReceptionists');
      expect(result).toHaveProperty('recentUsers');
    });

    it('should return dokter dashboard for dokter role', async () => {
      // Create a dokter user
      const userResult = await db.insert(usersTable).values({
        username: 'dokter_role_test',
        email: 'dokter_role@test.com',
        password_hash: 'hash',
        role: 'dokter',
        full_name: 'Dr. Role Test',
        is_active: true
      }).returning().execute();

      const userId = userResult[0].id;
      const result = await getDashboardByRole(userId, 'dokter');

      // Should return DokterDashboardData structure
      expect(result).toHaveProperty('todayAppointments');
      expect(result).toHaveProperty('totalPatients');
      expect(result).toHaveProperty('doctorInfo');
    });

    it('should return resepsionist dashboard for resepsionist role', async () => {
      // Create a resepsionist user
      const userResult = await db.insert(usersTable).values({
        username: 'resepsionis_role_test',
        email: 'resepsionis_role@test.com',
        password_hash: 'hash',
        role: 'resepsionis',
        full_name: 'Receptionist Role Test',
        is_active: true
      }).returning().execute();

      const userId = userResult[0].id;
      const result = await getDashboardByRole(userId, 'resepsionis');

      // Should return ResepsionistDashboardData structure
      expect(result).toHaveProperty('todayAppointments');
      expect(result).toHaveProperty('pendingAppointments');
      expect(result).toHaveProperty('receptionistInfo');
    });

    it('should throw error for invalid role', async () => {
      const userId = 1;
      
      // @ts-ignore - Testing invalid role at runtime
      await expect(getDashboardByRole(userId, 'invalid_role')).rejects.toThrow(/Invalid role/i);
    });
  });
});