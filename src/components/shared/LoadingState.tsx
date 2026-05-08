'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingState() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-40 w-full rounded-none" />
                    <CardHeader className="pb-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between">
                            <Skeleton className="h-12 w-20" />
                            <Skeleton className="h-12 w-20" />
                        </div>
                        <Skeleton className="h-1.5 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-9 w-full rounded-md" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
