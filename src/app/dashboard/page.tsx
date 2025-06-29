"use client";

import { useEffect, useState } from "react"; // <-- Import useEffect
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { status } = useSession();

  // FIX: This logic is now inside a useEffect hook
  useEffect(() => {
    // If the session is loaded and the user is not authenticated, redirect
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]); // <-- This effect runs when status or router changes

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const projectsQuery = api.project.getAll.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const createProjectMutation = api.project.create.useMutation({
    onSuccess: () => {
      void projectsQuery.refetch();
      setNewProjectName("");
      setNewProjectDescription("");
    },
    onError: (error) => {
      alert(`Error creating project: ${error.message}`);
    },
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      createProjectMutation.mutate({
        name: newProjectName,
        description: newProjectDescription,
      });
    }
  };

  // While the session is loading or we're waiting for the redirect, show a loading state.
  if (status !== "authenticated") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  // If we reach here, the user is authenticated, so we can render the dashboard.
  return (
    <main className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-4xl font-bold">Your Projects</h1>

        {/* Form and project list code remains the same... */}
        <div className="mb-8 rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-2xl font-semibold">Create New Project</h2>
          <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="rounded bg-gray-700 p-2"
              required
            />
            <textarea
              placeholder="Project Description (optional)"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              className="rounded bg-gray-700 p-2"
            />
            <button
              type="submit"
              disabled={createProjectMutation.isPending}
              className="self-start rounded bg-blue-600 px-4 py-2 font-bold hover:bg-blue-700 disabled:bg-gray-500"
            >
              {createProjectMutation.isPending ? "Creating..." : "Create Project"}
            </button>
          </form>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-semibold">Existing Projects</h2>
          {projectsQuery.isLoading && <p>Loading projects...</p>}
          {projectsQuery.isError && <p>Error loading projects.</p>}
          {projectsQuery.data && (
            <div className="space-y-4">
              {projectsQuery.data.length === 0 ? (
                <p className="text-gray-400">You havent created any projects yet.</p>
              ) : (
                projectsQuery.data.map((project) => (
                  <div key={project.id} className="rounded-lg bg-gray-800 p-4">
                    <h3 className="text-xl font-bold">{project.name}</h3>
                    <p className="text-gray-400">{project.description}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}