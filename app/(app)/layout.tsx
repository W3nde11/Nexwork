import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { AppShell } from "@/components/AppShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  let name = session.name;
  let avatar: string | null = null;
  try {
    await connectDB();
    const u = await User.findById(session.sub).lean<{ name?: string; avatar?: string | null } | null>();
    if (u && "name" in u && u.name) name = u.name;
    if (u && "avatar" in u) avatar = u.avatar ?? null;
  } catch {
    /* cookie válido sem DB */
  }

  return (
    <AppShell userName={name} userAvatar={avatar}>
      {children}
    </AppShell>
  );
}
