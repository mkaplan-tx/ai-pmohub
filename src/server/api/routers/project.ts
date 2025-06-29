import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const projectRouter = createTRPCRouter({
  
  // Endpoint to CREATE a new project
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // We use `ctx.session.user.id` to ensure the project is created
      // by and owned by the currently logged-in user.
      const project = await db.project.create({
        data: {
          name: input.name,
          description: input.description,
          ownerId: ctx.session.user.id, // <-- SECURITY: Link to logged-in user
        },
      });

      // Automatically make the creator a member of the project
      await db.projectMember.create({
        data: {
          projectId: project.id,
          userId: ctx.session.user.id,
          role: "Owner", // Define a role for the member
        },
      });

      return project;
    }),

  // Endpoint to GET all projects the user is part of
  getAll: protectedProcedure.query(async ({ ctx }) => {
    // This is the key to multi-user security. We only find projects where
    // the user is either the owner OR a member.
    return db.project.findMany({
      where: {
        OR: [
          {
            // Condition 1: The logged-in user is the owner
            ownerId: ctx.session.user.id,
          },
          {
            // Condition 2: The logged-in user is listed in the members table for this project
            members: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        ],
      },
      // Optionally, you can order them by most recently updated
      orderBy: { updatedAt: "desc" },
    });
  }),
});