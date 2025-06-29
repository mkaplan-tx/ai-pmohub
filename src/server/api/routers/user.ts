import { hash } from "bcrypt";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const userRouter = createTRPCRouter({
    signup: publicProcedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string().min(8), // Enforce a minimum password length
            }),
        )
        .mutation(async ({ input }) => {
            const { email, password } = input;

            const hashedPassword = await hash(password, 12);

            const user = await db.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });

            return {
                id: user.id,
                email: user.email,
            };
        }),
});