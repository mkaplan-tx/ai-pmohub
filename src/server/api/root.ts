import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in `src/server/api/routers` should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // Our new routers will be added here later
});

// export type definition of API
export type AppRouter = typeof appRouter;
