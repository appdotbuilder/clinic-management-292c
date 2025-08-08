import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { usersTable, sessionsTable } from '../db/schema';
import { type CreateUserInput, type UpdateUserInput } from '../schema';
import { createUser, updateUser, getUser, getAllUsers, deleteUser, verifyPassword } from '../handlers/users';
import { eq } from 'drizzle-orm';

// Test input data
const testCreateUserInput: CreateUserInput = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'testpassword123',
  role: 'admin',
  full_name: 'Test User',
  is_active: true
};

const testDokterInput: CreateUserInput = {
  username: 'dokter1',
  email: 'dokter@example.com',
  password: 'dokterpass123',
  role: 'dokter',
  full_name: 'Dr. Smith',
  is_active: true
};

const testResepsionisInput: CreateUserInput = {
  username: 'resepsionis1',
  email: 'resepsionis@example.com',
  password: 'resepsionispass123',
  role: 'resepsionis',
  full_name: 'Receptionist Johnson',
  is_active: true
};

describe('createUser', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a user successfully', async () => {
    const result = await createUser(testCreateUserInput);

    expect(result.username).toEqual('testuser');
    expect(result.email).toEqual('test@example.com');
    expect(result.role).toEqual('admin');
    expect(result.full_name).toEqual('Test User');
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.password_hash).toBeDefined();
    expect(result.password_hash).not.toEqual('testpassword123'); // Should be hashed
  });

  it('should hash the password correctly', async () => {
    const result = await createUser(testCreateUserInput);
    
    // Verify password was hashed
    const isValidHash = verifyPassword('testpassword123', result.password_hash);
    expect(isValidHash).toBe(true);
  });

  it('should save user to database', async () => {
    const result = await createUser(testCreateUserInput);

    const users = await db.select()
      .from(usersTable)
      .where(eq(usersTable.id, result.id))
      .execute();

    expect(users).toHaveLength(1);
    expect(users[0].username).toEqual('testuser');
    expect(users[0].email).toEqual('test@example.com');
    expect(users[0].role).toEqual('admin');
    expect(users[0].full_name).toEqual('Test User');
    expect(users[0].is_active).toEqual(true);
  });

  it('should create users with different roles', async () => {
    const adminUser = await createUser(testCreateUserInput);
    const dokterUser = await createUser(testDokterInput);
    const resepsionisUser = await createUser(testResepsionisInput);

    expect(adminUser.role).toEqual('admin');
    expect(dokterUser.role).toEqual('dokter');
    expect(resepsionisUser.role).toEqual('resepsionis');
  });

  it('should reject duplicate username', async () => {
    await createUser(testCreateUserInput);

    const duplicateInput = {
      ...testCreateUserInput,
      email: 'different@example.com'
    };

    await expect(createUser(duplicateInput)).rejects.toThrow(/username already exists/i);
  });

  it('should reject duplicate email', async () => {
    await createUser(testCreateUserInput);

    const duplicateInput = {
      ...testCreateUserInput,
      username: 'differentuser'
    };

    await expect(createUser(duplicateInput)).rejects.toThrow(/email already exists/i);
  });

  it('should handle inactive user creation', async () => {
    const inactiveUserInput = {
      ...testCreateUserInput,
      is_active: false
    };

    const result = await createUser(inactiveUserInput);
    expect(result.is_active).toBe(false);
  });
});

describe('updateUser', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update user successfully', async () => {
    const createdUser = await createUser(testCreateUserInput);

    const updateInput: UpdateUserInput = {
      id: createdUser.id,
      full_name: 'Updated Test User',
      email: 'updated@example.com'
    };

    const result = await updateUser(updateInput);

    expect(result.id).toEqual(createdUser.id);
    expect(result.full_name).toEqual('Updated Test User');
    expect(result.email).toEqual('updated@example.com');
    expect(result.username).toEqual('testuser'); // Unchanged
    expect(result.updated_at).not.toEqual(createdUser.updated_at);
  });

  it('should update password and hash it', async () => {
    const createdUser = await createUser(testCreateUserInput);
    const originalPasswordHash = createdUser.password_hash;

    const updateInput: UpdateUserInput = {
      id: createdUser.id,
      password: 'newpassword123'
    };

    const result = await updateUser(updateInput);

    expect(result.password_hash).not.toEqual(originalPasswordHash);
    const isValidHash = verifyPassword('newpassword123', result.password_hash);
    expect(isValidHash).toBe(true);
  });

  it('should update user role', async () => {
    const createdUser = await createUser(testCreateUserInput);

    const updateInput: UpdateUserInput = {
      id: createdUser.id,
      role: 'dokter'
    };

    const result = await updateUser(updateInput);
    expect(result.role).toEqual('dokter');
  });

  it('should update is_active status', async () => {
    const createdUser = await createUser(testCreateUserInput);

    const updateInput: UpdateUserInput = {
      id: createdUser.id,
      is_active: false
    };

    const result = await updateUser(updateInput);
    expect(result.is_active).toBe(false);
  });

  it('should reject update for non-existent user', async () => {
    const updateInput: UpdateUserInput = {
      id: 999,
      full_name: 'Non-existent User'
    };

    await expect(updateUser(updateInput)).rejects.toThrow(/user not found/i);
  });

  it('should reject username conflicts', async () => {
    const user1 = await createUser(testCreateUserInput);
    const user2 = await createUser(testDokterInput);

    const updateInput: UpdateUserInput = {
      id: user2.id,
      username: user1.username
    };

    await expect(updateUser(updateInput)).rejects.toThrow(/username already exists/i);
  });

  it('should reject email conflicts', async () => {
    const user1 = await createUser(testCreateUserInput);
    const user2 = await createUser(testDokterInput);

    const updateInput: UpdateUserInput = {
      id: user2.id,
      email: user1.email
    };

    await expect(updateUser(updateInput)).rejects.toThrow(/email already exists/i);
  });

  it('should allow updating user with same username/email', async () => {
    const createdUser = await createUser(testCreateUserInput);

    const updateInput: UpdateUserInput = {
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      full_name: 'Updated Name'
    };

    const result = await updateUser(updateInput);
    expect(result.full_name).toEqual('Updated Name');
  });
});

describe('getUser', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should get user by id', async () => {
    const createdUser = await createUser(testCreateUserInput);

    const result = await getUser(createdUser.id);

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(createdUser.id);
    expect(result!.username).toEqual('testuser');
    expect(result!.email).toEqual('test@example.com');
    expect(result!.role).toEqual('admin');
    expect(result!.full_name).toEqual('Test User');
  });

  it('should return null for non-existent user', async () => {
    const result = await getUser(999);
    expect(result).toBeNull();
  });

  it('should get user with all roles', async () => {
    const adminUser = await createUser(testCreateUserInput);
    const dokterUser = await createUser(testDokterInput);
    const resepsionisUser = await createUser(testResepsionisInput);

    const admin = await getUser(adminUser.id);
    const dokter = await getUser(dokterUser.id);
    const resepsionis = await getUser(resepsionisUser.id);

    expect(admin!.role).toEqual('admin');
    expect(dokter!.role).toEqual('dokter');
    expect(resepsionis!.role).toEqual('resepsionis');
  });
});

describe('getAllUsers', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no users exist', async () => {
    const result = await getAllUsers();
    expect(result).toEqual([]);
  });

  it('should return all users', async () => {
    await createUser(testCreateUserInput);
    await createUser(testDokterInput);
    await createUser(testResepsionisInput);

    const result = await getAllUsers();

    expect(result).toHaveLength(3);
    expect(result.map(u => u.username)).toEqual(['testuser', 'dokter1', 'resepsionis1']);
    expect(result.map(u => u.role)).toEqual(['admin', 'dokter', 'resepsionis']);
  });

  it('should return users with all fields', async () => {
    await createUser(testCreateUserInput);

    const result = await getAllUsers();
    const user = result[0];

    expect(user.id).toBeDefined();
    expect(user.username).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.password_hash).toBeDefined();
    expect(user.role).toBeDefined();
    expect(user.full_name).toBeDefined();
    expect(user.is_active).toBeDefined();
    expect(user.created_at).toBeInstanceOf(Date);
    expect(user.updated_at).toBeInstanceOf(Date);
  });

  it('should include active and inactive users', async () => {
    await createUser(testCreateUserInput);
    await createUser({
      ...testDokterInput,
      is_active: false
    });

    const result = await getAllUsers();

    expect(result).toHaveLength(2);
    expect(result.find(u => u.is_active === true)).toBeDefined();
    expect(result.find(u => u.is_active === false)).toBeDefined();
  });
});

describe('deleteUser', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete existing user', async () => {
    const createdUser = await createUser(testCreateUserInput);

    const result = await deleteUser(createdUser.id);
    expect(result).toBe(true);

    // Verify user is deleted
    const deletedUser = await getUser(createdUser.id);
    expect(deletedUser).toBeNull();
  });

  it('should return false for non-existent user', async () => {
    const result = await deleteUser(999);
    expect(result).toBe(false);
  });

  it('should delete user and related sessions', async () => {
    const createdUser = await createUser(testCreateUserInput);

    // Create a session for the user
    await db.insert(sessionsTable)
      .values({
        id: 'test-session-id',
        user_id: createdUser.id,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      })
      .execute();

    // Verify session exists
    const sessionsBeforeDelete = await db.select()
      .from(sessionsTable)
      .where(eq(sessionsTable.user_id, createdUser.id))
      .execute();
    expect(sessionsBeforeDelete).toHaveLength(1);

    // Delete user
    const result = await deleteUser(createdUser.id);
    expect(result).toBe(true);

    // Verify sessions are also deleted
    const sessionsAfterDelete = await db.select()
      .from(sessionsTable)
      .where(eq(sessionsTable.user_id, createdUser.id))
      .execute();
    expect(sessionsAfterDelete).toHaveLength(0);
  });

  it('should verify user is removed from database', async () => {
    const user1 = await createUser(testCreateUserInput);
    const user2 = await createUser(testDokterInput);

    await deleteUser(user1.id);

    const allUsers = await getAllUsers();
    expect(allUsers).toHaveLength(1);
    expect(allUsers[0].id).toEqual(user2.id);
  });
});