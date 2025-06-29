"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await signIn("credentials", {
            // Do not redirect on error
            redirect: false,
            email,
            password,
        });

        setIsSubmitting(false);

        if (result?.ok) {
            // On successful login, redirect to the homepage
            router.push("/");
        } else {
            // Handle login errors (e.g., incorrect credentials)
            alert(result?.error || "An unknown error occurred. Please try again.");
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                <h1 className="text-4xl font-bold">Log In</h1>
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
                            Password
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
                        disabled={isSubmitting}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-center font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-500"
                    >
                        {isSubmitting ? "Logging In..." : "Log In"}
                    </button>
                </form>
            </div>
        </main>
    );
}