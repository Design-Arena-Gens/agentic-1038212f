import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { findUserById } from "@/lib/mock-db";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }
  const profile = await findUserById(session.user.id);
  return (
    <AppShell locale={profile?.language ?? "ar"} userName={profile?.name ?? ""}>
      {children}
    </AppShell>
  );
}
