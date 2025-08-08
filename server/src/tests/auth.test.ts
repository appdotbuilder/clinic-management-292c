import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { usersTable, sessionsTable } from '../db/schema';
import { type LoginInput, type CreateSessionInput, type VerifySessionInput } from '../schema';
import { login, createSession, verifySession, logout } from '../handlers/auth';
import { eq } from 'drizzle-orm';

describe('Authentication Handlers', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  describe('login', () => {
    beforeEach(async () => {
      // Create test users with different roles and statuses
      const hashedPassword = await Bun.password.hash('testpassword123');
      const inactivePassword = await Bun.password.hash('inactive123');

      await db.insert(usersTable).values([
        {
          username: 'admin_user',
          email: 'admin@example.com',
          password_hash: hashedPassword,
          role: 'admin',
          full_name: 'Admin User',
          is_active: true
        },
        {
          username: 'dokter_user',
          email: 'dokter@example.com',
          password_hash: hashedPassword,
          role: 'dokter',
          full_name: 'Dr. Smith',
          is_active: true
        },
        {
          username: 'resepsionis_user',
          email: 'resepsionis@example.com',
          password_hash: hashedPassword,
          role: 'resepsionis',
          full_name: 'Receptionist Jones',
          is_active: true
        },
        {
          username: 'inactive_user',
          email: 'inactive@example.com',
          password_hash: inactivePassword,
          role: 'admin',
          full_name: 'Inactive User',
          is_active: false
        }
      ]).execute();
    });

    it('should successfully login admin user', async () => {
      const loginInput: LoginInput = {
        username: 'admin_user',
        password: 'testpassword123'
      };

      const result = await login(loginInput);

      expect(result.success).toBe(true);
      expect(result.user).not.toBeNull();
      expect(result.user!.username).toBe('admin_user');
      expect(result.user!.role).toBe('admin');
      expect(result.user!.full_name).toBe('Admin User');
      expect(result.user!.is_active).toBe(true);
      expect(result.redirectPath).toBe('/admin/dashboard');
      expect(result.message).toBeNull();
    });

    it('should successfully login dokter user', async () => {
      const loginInput: LoginInput = {
        username: 'dokter_user',
        password: 'testpassword123'
      };

      const result = await login(loginInput);

      expect(result.success).toBe(true);
      expect(result.user!.role).toBe('dokter');
      expect(result.redirectPath).toBe('/dokter/dashboard');
    });

    it('should successfully login resepsionis user', async () => {
      const loginInput: LoginInput = {
        username: 'resepsionis_user',
        password: 'testpassword123'
      };

      const result = await login(loginInput);

      expect(result.success).toBe(true);
      expect(result.user!.role).toBe('resepsionis');
      expect(result.redirectPath).toBe('/resepsionis/dashboard');
    });

    it('should fail login with invalid username', async () => {
      const loginInput: LoginInput = {
        username: 'nonexistent_user',
        password: 'testpassword123'
      };

      const result = await login(loginInput);

      expect(result.success).toBe(false);
      expect(result.user).toBeNull();
      expect(result.redirectPath).toBeNull();
      expect(result.message).toBe('Invalid credentials');
    });

    it('should fail login with invalid password', async () => {
      const loginInput: LoginInput = {
        username: 'admin_user',
        password: 'wrongpassword'
      };

      const result = await login(loginInput);

      expect(result.success).toBe(false);
      expect(result.user).toBeNull();
      expect(result.redirectPath).toBeNull();
      expect(result.message).toBe('Invalid credentials');
    });

    it('should fail login for inactive user', async () => {
      const loginInput: LoginInput = {
        username: 'inactive_user',
        password: 'inactive123'
      };

      const result = await login(loginInput);

      expect(result.success).toBe(false);
      expect(result.user).toBeNull();
      expect(result.redirectPath).toBeNull();
      expect(result.message).toBe('Account is deactivated');
    });
  });

  describe('createSession', () => {
    let userId: number;

    beforeEach(async () => {
      // Create a test user
      const hashedPassword = await Bun.password.hash('testpassword');
      const result = await db.insert(usersTable).values({
        username: 'test_user',
        email: 'test@example.com',
        password_hash: hashedPassword,
        role: 'admin',
        full_name: 'Test User',
        is_active: true
      }).returning().execute();

      userId = result[0].id;
    });

    it('should create a new session', async () => {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
      const sessionInput: CreateSessionInput = {
        user_id: userId,
        expires_at: expiresAt
      };

      const sessionId = await createSession(sessionInput);

      expect(typeof sessionId).toBe('string');
      expect(sessionId.length).toBeGreaterThan(0);

      // Verify session was saved to database
      const sessions = await db.select()
        .from(sessionsTable)
        .where(eq(sessionsTable.id, sessionId))
        .execute();

      expect(sessions).toHaveLength(1);
      expect(sessions[0].user_id).toBe(userId);
      expect(sessions[0].expires_at).toEqual(expiresAt);
    });

    it('should generate unique session IDs', async () => {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const sessionInput: CreateSessionInput = {
        user_id: userId,
        expires_at: expiresAt
      };

      const sessionId1 = await createSession(sessionInput);
      const sessionId2 = await createSession(sessionInput);

      expect(sessionId1).not.toBe(sessionId2);
    });
  });

  describe('verifySession', () => {
    let userId: number;
    let validSessionId: string;
    let expiredSessionId: string;

    beforeEach(async () => {
      // Create test user
      const hashedPassword = await Bun.password.hash('testpassword');
      const userResult = await db.insert(usersTable).values({
        username: 'test_user',
        email: 'test@example.com',
        password_hash: hashedPassword,
        role: 'dokter',
        full_name: 'Test Doctor',
        is_active: true
      }).returning().execute();

      userId = userResult[0].id;

      // Create valid session
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      validSessionId = await createSession({
        user_id: userId,
        expires_at: futureDate
      });

      // Create expired session
      const pastDate = new Date(Date.now() - 60 * 1000); // 1 minute ago
      expiredSessionId = await createSession({
        user_id: userId,
        expires_at: pastDate
      });
    });

    it('should verify valid session', async () => {
      const verifyInput: VerifySessionInput = {
        session_id: validSessionId
      };

      const result = await verifySession(verifyInput);

      expect(result.valid).toBe(true);
      expect(result.user).not.toBeNull();
      expect(result.user!.id).toBe(userId);
      expect(result.user!.username).toBe('test_user');
      expect(result.user!.role).toBe('dokter');
      expect(result.user!.full_name).toBe('Test Doctor');
    });

    it('should reject expired session', async () => {
      const verifyInput: VerifySessionInput = {
        session_id: expiredSessionId
      };

      const result = await verifySession(verifyInput);

      expect(result.valid).toBe(false);
      expect(result.user).toBeNull();
    });

    it('should reject non-existent session', async () => {
      const verifyInput: VerifySessionInput = {
        session_id: 'non-existent-session-id'
      };

      const result = await verifySession(verifyInput);

      expect(result.valid).toBe(false);
      expect(result.user).toBeNull();
    });

    it('should reject session for inactive user', async () => {
      // Create inactive user
      const hashedPassword = await Bun.password.hash('testpassword');
      const inactiveUserResult = await db.insert(usersTable).values({
        username: 'inactive_user',
        email: 'inactive@example.com',
        password_hash: hashedPassword,
        role: 'admin',
        full_name: 'Inactive User',
        is_active: false
      }).returning().execute();

      // Create session for inactive user
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const inactiveSessionId = await createSession({
        user_id: inactiveUserResult[0].id,
        expires_at: futureDate
      });

      const verifyInput: VerifySessionInput = {
        session_id: inactiveSessionId
      };

      const result = await verifySession(verifyInput);

      expect(result.valid).toBe(false);
      expect(result.user).toBeNull();
    });
  });

  describe('logout', () => {
    let sessionId: string;

    beforeEach(async () => {
      // Create user and session
      const hashedPassword = await Bun.password.hash('testpassword');
      const userResult = await db.insert(usersTable).values({
        username: 'test_user',
        email: 'test@example.com',
        password_hash: hashedPassword,
        role: 'admin',
        full_name: 'Test User',
        is_active: true
      }).returning().execute();

      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      sessionId = await createSession({
        user_id: userResult[0].id,
        expires_at: futureDate
      });
    });

    it('should successfully logout and remove session', async () => {
      // Verify session exists before logout
      const sessionsBefore = await db.select()
        .from(sessionsTable)
        .where(eq(sessionsTable.id, sessionId))
        .execute();
      expect(sessionsBefore).toHaveLength(1);

      // Logout
      const result = await logout(sessionId);
      expect(result).toBe(true);

      // Verify session is removed
      const sessionsAfter = await db.select()
        .from(sessionsTable)
        .where(eq(sessionsTable.id, sessionId))
        .execute();
      expect(sessionsAfter).toHaveLength(0);
    });

    it('should return true even for non-existent session', async () => {
      const result = await logout('non-existent-session-id');
      expect(result).toBe(true);
    });
  });

  describe('integration test - full auth flow', () => {
    it('should complete full authentication flow', async () => {
      // Step 1: Create user
      const hashedPassword = await Bun.password.hash('fullflowtest');
      await db.insert(usersTable).values({
        username: 'flow_user',
        email: 'flow@example.com',
        password_hash: hashedPassword,
        role: 'resepsionis',
        full_name: 'Flow Test User',
        is_active: true
      }).execute();

      // Step 2: Login
      const loginResult = await login({
        username: 'flow_user',
        password: 'fullflowtest'
      });

      expect(loginResult.success).toBe(true);
      expect(loginResult.user!.role).toBe('resepsionis');

      // Step 3: Create session
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const sessionId = await createSession({
        user_id: loginResult.user!.id,
        expires_at: expiresAt
      });

      // Step 4: Verify session
      const sessionResult = await verifySession({ session_id: sessionId });
      expect(sessionResult.valid).toBe(true);
      expect(sessionResult.user!.username).toBe('flow_user');

      // Step 5: Logout
      const logoutResult = await logout(sessionId);
      expect(logoutResult).toBe(true);

      // Step 6: Verify session is invalid after logout
      const verifyAfterLogout = await verifySession({ session_id: sessionId });
      expect(verifyAfterLogout.valid).toBe(false);
    });
  });
});