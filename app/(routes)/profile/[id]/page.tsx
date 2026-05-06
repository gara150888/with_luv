import { fetchProfileByUsername } from "@/features/profile/actions";
import PublicProfilePage from "@/features/profile/components/PublicProfilePage";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const res = await fetchProfileByUsername(id)

    if (!res.success || !res.profile) { notFound() }

    return <PublicProfilePage profile={res.profile} />
}