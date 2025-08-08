import { db } from '../db';
import { usersTable, sessionsTable } from '../db/schema';
import { type LoginInput, type LoginResponse, type CreateSessionInput, type VerifySessionInput, type SessionResponse } from '../schema';
import { eq, and, gte } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function login(input: LoginInput): Promise<LoginResponse> {
  try {
    // Find user by username
    const users = await db.select()
      .from(usersTable)
      .where(eq(usersTable.username, input.username))
      .execute();

    if (users.length === 0) {
      return {
        success: false,
        user: null,
        redirectPath: null,
        message: 'Invalid credentials'
      };
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      return {
        success: false,
        user: null,
        redirectPath: null,
        message: 'Account is deactivated'
      };
    }

    // Verify password using Bun's built-in password hashing
    const isValidPassword = await Bun.password.verify(input.password, user.password_hash);
    
    if (!isValidPassword) {
      return {
        success: false,
        user: null,
        redirectPath: null,
        message: 'Invalid credentials'
      };
    }

    // Determine redirect path based on role
    const redirectPaths = {
      admin: '/admin/dashboard',
      dokter: '/dokter/dashboard',
      resepsionis: '/resepsionis/dashboard'
    };

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        is_active: user.is_active
      },
      redirectPath: redirectPaths[user.role],
      message: null
    };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function createSession(input: CreateSessionInput): Promise<string> {
  try {
    // Generate unique session ID
    const sessionId = randomUUID();

    // Insert session into database
    await db.insert(sessionsTable)
      .values({
        id: sessionId,
        user_id: input.user_id,
        expires_at: input.expires_at
      })
      .execute();

    return sessionId;
  } catch (error) {
    console.error('Session creation failed:', error);
    throw error;
  }
}

export async function verifySession(input: VerifySessionInput): Promise<SessionResponse> {
  try {
    // Query session with user information
    const results = await db.select({
      session: sessionsTable,
      user: usersTable
    })
      .from(sessionsTable)
      .innerJoin(usersTable, eq(sessionsTable.user_id, usersTable.id))
      .where(
        and(
          eq(sessionsTable.id, input.session_id),
          gte(sessionsTable.expires_at, new Date())
        )
      )
      .execute();

    if (results.length === 0) {
      return {
        valid: false,
        user: null
      };
    }

    const result = results[0];
    const user = result.user;

    // Check if user is still active
    if (!user.is_active) {
      return {
        valid: false,
        user: null
      };
    }

    return {
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        is_active: user.is_active
      }
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    throw error;
  }
}

export async function logout(sessionId: string): Promise<boolean> {
  try {
    // Delete session from database
    await db.delete(sessionsTable)
      .where(eq(sessionsTable.id, sessionId))
      .execute();

    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}