import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { projectRouter } from "./routers/project"; // <-- Import the new router

export const appRouter = createTRPCRouter({
  user: userRouter,
  project: projectRouter, // <-- Add the project router here
});

export type AppRouter = typeof appRouter;