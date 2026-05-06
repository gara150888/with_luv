// page.tsx 
import { fetchProfile } from "@/features/profile/actions";
import EditProfilePage from "@/features/profile/components/EditProfilePage";

export default async function EditProfile() {
    const profile = await fetchProfile()

    return (
        <EditProfilePage profile={profile} />
    );
}
