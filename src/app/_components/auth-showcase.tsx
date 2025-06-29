"use client";

import { useSession, signIn, signOut } from "next-auth/react";

// This is a NAMED export
export function AuthShowcase() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {session && <span>Logged in as {session.user?.email}</span>}
      </p>
      <button
        onClick={session ? () => signOut() : () => signIn()}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        {session ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}