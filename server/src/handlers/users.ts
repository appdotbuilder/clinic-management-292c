import { db } from '../db';
import { usersTable, sessionsTable } from '../db/schema';
import { type CreateUserInput, type UpdateUserInput, type User } from '../schema';
import { eq, or } from 'drizzle-orm';
import { createHash, randomBytes, pbkdf2Sync } from 'crypto';

// Helper function to hash passwords
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return salt + ':' + hash;
}

// Helper function to verify passwords
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  
  const verifyHash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  try {
    // Check if username or email already exists
    const existingUsers = await db.select()
      .from(usersTable)
      .where(or(
        eq(usersTable.username, input.username),
        eq(usersTable.email, input.email)
      ))
      .execute();

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      if (existingUser.username === input.username) {
        throw new Error('Username already exists');
      }
      if (existingUser.email === input.email) {
        throw new Error('Email already exists');
      }
    }

    // Hash the password
    const password_hash = hashPassword(input.password);

    // Insert new user into database
    const result = await db.insert(usersTable)
      .values({
        username: input.username,
        email: input.email,
        password_hash,
        role: input.role,
        full_name: input.full_name,
        is_active: input.is_active,
        updated_at: new Date()
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('User creation failed:', error);
    throw error;
  }
}

export async function updateUser(input: UpdateUserInput): Promise<User> {
  try {
    // Check if user exists
    const existingUsers = await db.select()
      .from(usersTable)
      .where(eq(usersTable.id, input.id))
      .execute();

    if (existingUsers.length === 0) {
      throw new Error('User not found');
    }

    // Check for username/email conflicts if they are being updated
    if (input.username || input.email) {
      const conditions = [];
      if (input.username) {
        conditions.push(eq(usersTable.username, input.username));
      }
      if (input.email) {
        conditions.push(eq(usersTable.email, input.email));
      }

      const conflictingUsers = await db.select()
        .from(usersTable)
        .where(or(...conditions))
        .execute();

      for (const user of conflictingUsers) {
        // Skip if it's the same user being updated
        if (user.id === input.id) continue;

        if (input.username && user.username === input.username) {
          throw new Error('Username already exists');
        }
        if (input.email && user.email === input.email) {
          throw new Error('Email already exists');
        }
      }
    }

    // Prepare update values
    const updateValues: any = {
      updated_at: new Date()
    };

    if (input.username !== undefined) updateValues.username = input.username;
    if (input.email !== undefined) updateValues.email = input.email;
    if (input.role !== undefined) updateValues.role = input.role;
    if (input.full_name !== undefined) updateValues.full_name = input.full_name;
    if (input.is_active !== undefined) updateValues.is_active = input.is_active;

    // Hash new password if provided
    if (input.password !== undefined) {
      updateValues.password_hash = hashPassword(input.password);
    }

    // Update user in database
    const result = await db.update(usersTable)
      .set(updateValues)
      .where(eq(usersTable.id, input.id))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('User update failed:', error);
    throw error;
  }
}

export async function getUser(id: number): Promise<User | null> {
  try {
    const users = await db.select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .execute();

    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Get user failed:', error);
    throw error;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const users = await db.select()
      .from(usersTable)
      .execute();

    return users;
  } catch (error) {
    console.error('Get all users failed:', error);
    throw error;
  }
}

export async function deleteUser(id: number): Promise<boolean> {
  try {
    // Check if user exists
    const existingUsers = await db.select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .execute();

    if (existingUsers.length === 0) {
      return false;
    }

    // Delete related sessions first (cascade should handle this, but being explicit)
    await db.delete(sessionsTable)
      .where(eq(sessionsTable.user_id, id))
      .execute();

    // Delete user from database
    const result = await db.delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning()
      .execute();

    return result.length > 0;
  } catch (error) {
    console.error('User deletion failed:', error);
    throw error;
  }
}