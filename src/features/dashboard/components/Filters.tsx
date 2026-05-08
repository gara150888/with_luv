import { Field } from "@/components/ui/field"
import { Search } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"

export default function Filters({
    searchTerm,
    setSearchTerm,
    selectedMode,
    setSelectedMode,
    selectedStatus,
    setSelectedStatus,
}: any) {
    return (
        <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative flex-1">
                <Field>
                    <InputGroup>
                        <InputGroupAddon>
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </InputGroupAddon>
                        <InputGroupInput
                            placeholder="Search games..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Field>
            </div>
            <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Game Mode" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="BR">Battle Royale</SelectItem>
                    <SelectItem value="LW">Last Warrior</SelectItem>
                    <SelectItem value="CS">Capture & Strike</SelectItem>
                </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}