"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

interface DashboardHeaderProps {
  companyName: string;
}

export function DashboardHeader({ companyName }: DashboardHeaderProps) {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-900">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">{companyName}</span>
          <span className="text-sm text-zinc-500">Dashboard</span>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-zinc-400 truncate max-w-[200px]">{user.email}</span>
            <a
              href="/auth/logout"
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
            >
              Log out
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
