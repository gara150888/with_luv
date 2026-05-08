import { getMatch } from "@/features/matches/actions"
import DashboardPage from "@/features/matches/components/DashboardPage"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const data = await getMatch(id)

    return (<DashboardPage data={data as any} />)
}