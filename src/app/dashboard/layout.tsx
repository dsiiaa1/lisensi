"use client";

import Topbar from "@/components/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-dot-pattern">
      <Topbar />
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
        {children}
      </main>
    </div>
  );
}
