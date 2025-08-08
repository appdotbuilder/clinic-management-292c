import { db } from '../db';
import { usersTable } from '../db/schema';
import { type AdminDashboardData, type DokterDashboardData, type ResepsionistDashboardData, type UserRole } from '../schema';
import { eq, desc, count, and } from 'drizzle-orm';

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  try {
    // Count total users by role (only active users)
    const [allUsersResult, doctorsResult, receptionistsResult] = await Promise.all([
      db.select({ count: count() }).from(usersTable).where(eq(usersTable.is_active, true)).execute(),
      db.select({ count: count() }).from(usersTable).where(and(eq(usersTable.role, 'dokter'), eq(usersTable.is_active, true))).execute(),
      db.select({ count: count() }).from(usersTable).where(and(eq(usersTable.role, 'resepsionis'), eq(usersTable.is_active, true))).execute()
    ]);

    // Fetch recent user registrations (last 5 users)
    const recentUsersResult = await db.select({
      id: usersTable.id,
      username: usersTable.username,
      role: usersTable.role,
      full_name: usersTable.full_name,
      created_at: usersTable.created_at
    })
      .from(usersTable)
      .where(eq(usersTable.is_active, true))
      .orderBy(desc(usersTable.created_at))
      .limit(5)
      .execute();

    return {
      totalUsers: allUsersResult[0].count,
      totalDoctors: doctorsResult[0].count,
      totalReceptionists: receptionistsResult[0].count,
      recentUsers: recentUsersResult
    };
  } catch (error) {
    console.error('Admin dashboard fetch failed:', error);
    throw error;
  }
}

export async function getDokterDashboard(userId: number): Promise<DokterDashboardData> {
  try {
    // Fetch doctor information
    const doctorResult = await db.select({
      id: usersTable.id,
      full_name: usersTable.full_name,
      username: usersTable.username
    })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .execute();

    if (doctorResult.length === 0) {
      throw new Error('Doctor not found');
    }

    // For now, return mock data for appointments and patients
    // In a real implementation, these would come from appointments and patients tables
    return {
      todayAppointments: 0, // Mock data - would query appointments table
      totalPatients: 0, // Mock data - would query patients table
      doctorInfo: doctorResult[0]
    };
  } catch (error) {
    console.error('Dokter dashboard fetch failed:', error);
    throw error;
  }
}

export async function getResepsionistDashboard(userId: number): Promise<ResepsionistDashboardData> {
  try {
    // Fetch receptionist information
    const receptionistResult = await db.select({
      id: usersTable.id,
      full_name: usersTable.full_name,
      username: usersTable.username
    })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .execute();

    if (receptionistResult.length === 0) {
      throw new Error('Receptionist not found');
    }

    // For now, return mock data for appointments
    // In a real implementation, these would come from appointments table
    return {
      todayAppointments: 0, // Mock data - would query appointments table
      pendingAppointments: 0, // Mock data - would query appointments table with pending status
      receptionistInfo: receptionistResult[0]
    };
  } catch (error) {
    console.error('Resepsionist dashboard fetch failed:', error);
    throw error;
  }
}

export async function getDashboardByRole(userId: number, role: UserRole): Promise<AdminDashboardData | DokterDashboardData | ResepsionistDashboardData> {
  try {
    switch (role) {
      case 'admin':
        return await getAdminDashboard();
      case 'dokter':
        return await getDokterDashboard(userId);
      case 'resepsionis':
        return await getResepsionistDashboard(userId);
      default:
        throw new Error(`Invalid role: ${role}`);
    }
  } catch (error) {
    console.error('Dashboard fetch by role failed:', error);
    throw error;
  }
}