"use client";

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full gap-4">
            <h2 className="text-2xl font-bold">Something went wrong!</h2>
            <p className="text-red-500 text-sm">{error.message}</p>
            <Button onClick={reset}>Try again</Button>
        </div>
    );
}