export { formatDateTime, formatTimeRemaining } from "@/lib/date"
export function getMatchTypeColor(type: string) {
    switch (type.toLowerCase()) {
        case 'solo': return 'bg-blue-500 hover:bg-blue-600'
        case 'duo': return 'bg-purple-500 hover:bg-purple-600'
        case 'squad': return 'bg-orange-500 hover:bg-orange-600'
        default: return 'bg-gray-500 hover:bg-gray-600'
    }
}
export function getMatchTypeBadgeVariant(type: string): "default" | "secondary" | "destructive" | "outline" {
    switch (type.toLowerCase()) {
        case 'solo': return 'default'
        case 'duo': return 'secondary'
        case 'squad': return 'destructive'
        default: return 'outline'
    }
}
