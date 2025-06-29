import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user"; // Import the new router

/**
 * This is the primary router for your server.
 *
 * All routers added in \`src/server/api/routers\` should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter, // Add the user router to the app
});

// export type definition of API
export type AppRouter = typeof appRouter;