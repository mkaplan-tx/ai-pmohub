import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";

import { db } from "@/server/db";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            // You can leave this empty if you build your own login form
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                // 1. Find user by email in the database
                const user = await db.user.findUnique({
                    where: {
                        email: credentials.email as string,
                    },
                });

                if (!user) {
                    // User not found
                    return null;
                }

                // 2. Compare passwords
                const isPasswordValid = await compare(
                    credentials.password as string,
                    user.password,
                );

                if (!isPasswordValid) {
                    // Password incorrect
                    return null;
                }

                // 3. Return user object if everything is valid
                return user;
            },
        }),
    ],
});