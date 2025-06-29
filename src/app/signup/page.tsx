"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

export default function SignUpPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signupMutation = api.user.signup.useMutation({
        onSuccess: () => {
            // On successful sign-up, redirect to the login page
            alert("Account created successfully! Please log in.");
            router.push("/login");
        },
        onError: (error) => {
            // Handle errors, e.g., user already exists or validation failed
            alert(`Error creating account: ${error.message}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        signupMutation.mutate({ email, password });
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                <h1 className="text-4xl font-bold">Create an Account</h1>
                <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border bg-gray-700 p-2.5 text-white placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium"
                        >
                            Password (min. 8 characters)
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border bg-gray-700 p-2.5 text-white placeholder-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={signupMutation.isPending}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-center font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-500"
                    >
                        {signupMutation.isPending ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </main>
    );
}