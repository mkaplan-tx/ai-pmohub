import { AuthShowcase } from "@/app/_components/auth-showcase"; // This is a NAMED import

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          AI PMO Hub
        </h1>
        
        <AuthShowcase />

      </div>
    </main>
  );
}