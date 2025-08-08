import { z } from 'zod';

// User role enum schema
export const userRoleSchema = z.enum(['admin', 'dokter', 'resepsionis']);
export type UserRole = z.infer<typeof userRoleSchema>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  role: userRoleSchema,
  full_name: z.string(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Login input schema
export const loginInputSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// Login response schema
export const loginResponseSchema = z.object({
  success: z.boolean(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    role: userRoleSchema,
    full_name: z.string(),
    is_active: z.boolean()
  }).nullable(),
  redirectPath: z.string().nullable(),
  message: z.string().nullable()
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

// Create user input schema
export const createUserInputSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: userRoleSchema,
  full_name: z.string().min(1, "Full name is required"),
  is_active: z.boolean().default(true)
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

// Update user input schema
export const updateUserInputSchema = z.object({
  id: z.number(),
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: userRoleSchema.optional(),
  full_name: z.string().min(1).optional(),
  is_active: z.boolean().optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Session schema
export const sessionSchema = z.object({
  id: z.string(),
  user_id: z.number(),
  expires_at: z.coerce.date(),
  created_at: z.coerce.date()
});

export type Session = z.infer<typeof sessionSchema>;

// Create session input schema
export const createSessionInputSchema = z.object({
  user_id: z.number(),
  expires_at: z.date()
});

export type CreateSessionInput = z.infer<typeof createSessionInputSchema>;

// Verify session input schema
export const verifySessionInputSchema = z.object({
  session_id: z.string()
});

export type VerifySessionInput = z.infer<typeof verifySessionInputSchema>;

// Session response schema
export const sessionResponseSchema = z.object({
  valid: z.boolean(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    role: userRoleSchema,
    full_name: z.string(),
    is_active: z.boolean()
  }).nullable()
});

export type SessionResponse = z.infer<typeof sessionResponseSchema>;

// Dashboard data schemas for different roles
export const adminDashboardDataSchema = z.object({
  totalUsers: z.number(),
  totalDoctors: z.number(),
  totalReceptionists: z.number(),
  recentUsers: z.array(z.object({
    id: z.number(),
    username: z.string(),
    role: userRoleSchema,
    full_name: z.string(),
    created_at: z.coerce.date()
  }))
});

export type AdminDashboardData = z.infer<typeof adminDashboardDataSchema>;

export const dokterDashboardDataSchema = z.object({
  todayAppointments: z.number(),
  totalPatients: z.number(),
  doctorInfo: z.object({
    id: z.number(),
    full_name: z.string(),
    username: z.string()
  })
});

export type DokterDashboardData = z.infer<typeof dokterDashboardDataSchema>;

export const resepsionistDashboardDataSchema = z.object({
  todayAppointments: z.number(),
  pendingAppointments: z.number(),
  receptionistInfo: z.object({
    id: z.number(),
    full_name: z.string(),
    username: z.string()
  })
});

export type ResepsionistDashboardData = z.infer<typeof resepsionistDashboardDataSchema>;