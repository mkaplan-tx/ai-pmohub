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
  // --- ADD THIS NEW CALLBACKS BLOCK ---
  callbacks: {
    // This callback is called whenever a JWT is created or updated.
    jwt({ token, user }) {
      if (user) {
        // On sign-in, add the user's ID to the token
        token.id = user.id;
      }
      return token;
    },
    // This callback is called whenever a session is accessed.
    session({ session, token }) {
      // Add the user ID from the token to the session object
      session.user.id = token.id as string;
      return session;
    },
  },
  // --- END OF NEW BLOCK ---
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        
        const user = await db.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }
        
        return user;
      },
    }),
  ],
});