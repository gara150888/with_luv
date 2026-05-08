import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingSkeleton() {
    return (
        <div className="space-y-6 p-6 lg:p-8">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden pt-0">
                        <Skeleton className="h-48 w-full" />
                        <CardHeader>
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}