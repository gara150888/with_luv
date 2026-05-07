import { redirect } from "next/navigation"
import { getAdmin } from "@/features/admin/actions"
import AdminDashboard from "@/features/admin/components/AdminDashboard"

export default async function Page() {
    const admin = await getAdmin()

    if (!admin) redirect("/dashboard")

    return (
        <div className="flex flex-1 flex-col">
            <AdminDashboard />
        </div>
    )
}
