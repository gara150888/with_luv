import { fetchProfile } from "@/features/profile/actions";
import ProfilePage from "@/features/profile/components/ProfilePage";

export default async function Profile() {
    const profile = await fetchProfile();

    return <ProfilePage profile={profile} />;
}
