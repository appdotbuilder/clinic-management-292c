import { type AdminDashboardData, type DokterDashboardData, type ResepsionistDashboardData, type UserRole } from '../schema';

export async function getAdminDashboard(): Promise<AdminDashboardData> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is to:
    // 1. Count total users by role
    // 2. Fetch recent user registrations
    // 3. Calculate statistics for admin overview
    // 4. Return comprehensive admin dashboard data
    
    return {
        totalUsers: 25,
        totalDoctors: 8,
        totalReceptionists: 5,
        recentUsers: [
            {
                id: 10,
                username: 'dokter.ahmad',
                role: 'dokter',
                full_name: 'Dr. Ahmad Rahman',
                created_at: new Date()
            },
            {
                id: 11,
                username: 'resepsionis.sarah',
                role: 'resepsionis',
                full_name: 'Sarah Williams',
                created_at: new Date()
            },
            {
                id: 12,
                username: 'dokter.maria',
                role: 'dokter',
                full_name: 'Dr. Maria Santos',
                created_at: new Date()
            }
        ]
    };
}

export async function getDokterDashboard(userId: number): Promise<DokterDashboardData> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is to:
    // 1. Fetch doctor-specific information
    // 2. Count today's appointments for this doctor
    // 3. Count total patients assigned to this doctor
    // 4. Return doctor dashboard data
    
    return {
        todayAppointments: 12,
        totalPatients: 150,
        doctorInfo: {
            id: userId,
            full_name: 'Dr. Smith',
            username: 'dokter.smith'
        }
    };
}

export async function getResepsionistDashboard(userId: number): Promise<ResepsionistDashboardData> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is to:
    // 1. Fetch receptionist-specific information
    // 2. Count today's appointments (all appointments)
    // 3. Count pending appointments that need attention
    // 4. Return receptionist dashboard data
    
    return {
        todayAppointments: 28,
        pendingAppointments: 7,
        receptionistInfo: {
            id: userId,
            full_name: 'Receptionist Johnson',
            username: 'resepsionis.johnson'
        }
    };
}

export async function getDashboardByRole(userId: number, role: UserRole): Promise<AdminDashboardData | DokterDashboardData | ResepsionistDashboardData> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is to:
    // 1. Route to appropriate dashboard based on user role
    // 2. Return role-specific dashboard data
    // 3. Handle authorization (ensure user can access their own dashboard)
    
    switch (role) {
        case 'admin':
            return await getAdminDashboard();
        case 'dokter':
            return await getDokterDashboard(userId);
        case 'resepsionis':
            return await getResepsionistDashboard(userId);
        default:
            throw new Error('Invalid role');
    }
}