import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad2 } from "lucide-react"

export const GameNotFound = ({ setSearchTerm, setSelectedMode, setSelectedStatus }: { setSearchTerm: (term: string) => void, setSelectedMode: (mode: string) => void, setSelectedStatus: (status: string) => void }) => {
    return <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
            <Gamepad2 className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No games found</p>
            <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
            </p>
            <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                    setSearchTerm("")
                    setSelectedMode("all")
                    setSelectedStatus("all")
                }}
            >
                Clear Filters
            </Button>
        </CardContent>
    </Card>
}