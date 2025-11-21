import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { findUserById } from "@/lib/mock-db";
import { SettingsScreen } from "@/components/settings/settings-screen";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const profile = session?.user?.id ? await findUserById(session.user.id) : null;

  if (!profile) {
    return null;
  }

  return <SettingsScreen profile={profile} />;
}
