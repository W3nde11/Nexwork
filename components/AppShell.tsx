"use client";

import { useRouter } from "next/navigation";
import { AppHeader } from "./AppHeader";

export function AppShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader userName={userName} onLogout={onLogout} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
