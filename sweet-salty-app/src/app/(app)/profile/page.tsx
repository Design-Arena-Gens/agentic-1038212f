import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { findUserById } from "@/lib/mock-db";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const profile = session?.user?.id ? await findUserById(session.user.id) : null;

  if (!profile) {
    return null;
  }

  return <ProfileForm profile={profile} />;
}
