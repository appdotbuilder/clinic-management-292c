import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  loginInputSchema, 
  createUserInputSchema, 
  updateUserInputSchema, 
  verifySessionInputSchema,
  userRoleSchema
} from './schema';

// Import handlers
import { login, createSession, verifySession, logout } from './handlers/auth';
import { createUser, updateUser, getUser, getAllUsers, deleteUser } from './handlers/users';
import { getAdminDashboard, getDokterDashboard, getResepsionistDashboard, getDashboardByRole } from './handlers/dashboard';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  auth: router({
    login: publicProcedure
      .input(loginInputSchema)
      .mutation(({ input }) => login(input)),
    
    verifySession: publicProcedure
      .input(verifySessionInputSchema)
      .query(({ input }) => verifySession(input)),
    
    logout: publicProcedure
      .input(verifySessionInputSchema)
      .mutation(({ input }) => logout(input.session_id))
  }),

  // User management routes (typically admin-only)
  users: router({
    create: publicProcedure
      .input(createUserInputSchema)
      .mutation(({ input }) => createUser(input)),
    
    update: publicProcedure
      .input(updateUserInputSchema)
      .mutation(({ input }) => updateUser(input)),
    
    getById: publicProcedure
      .input(z.number())
      .query(({ input }) => getUser(input)),
    
    getAll: publicProcedure
      .query(() => getAllUsers()),
    
    delete: publicProcedure
      .input(z.number())
      .mutation(({ input }) => deleteUser(input))
  }),

  // Dashboard routes
  dashboard: router({
    admin: publicProcedure
      .query(() => getAdminDashboard()),
    
    dokter: publicProcedure
      .input(z.number())
      .query(({ input }) => getDokterDashboard(input)),
    
    resepsionis: publicProcedure
      .input(z.number())
      .query(({ input }) => getResepsionistDashboard(input)),
    
    byRole: publicProcedure
      .input(z.object({
        userId: z.number(),
        role: userRoleSchema
      }))
      .query(({ input }) => getDashboardByRole(input.userId, input.role))
  })
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'], // Common frontend dev ports
        credentials: true
      })(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  
  server.listen(port);
  console.log(`🏥 Clinic TRPC server listening at port: ${port}`);
  console.log(`📊 Available dashboards:`);
  console.log(`   - Admin: /admin/dashboard`);
  console.log(`   - Dokter: /dokter/dashboard`);
  console.log(`   - Resepsionis: /resepsionis/dashboard`);
}

start().catch(console.error);