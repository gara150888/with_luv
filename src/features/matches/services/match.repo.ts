import db from "@/lib/db"
import { toCamelCaseMatch } from "@/lib/utils"
import { CreateMatchInput, UpdateMatchInput } from "../schemas/match.schema"

export function findAdminByEmail(email: string) {
    return db.admin.findUnique({ where: { email } })
}

export function createMatchRepo(data: CreateMatchInput) {
    const camelCaseData = toCamelCaseMatch(data)
    return db.match.create({ data: camelCaseData })
}

export function updateMatchRepo(id: string, data: Omit<UpdateMatchInput, 'id'>) {
    const camelCaseData = toCamelCaseMatch(data)
    return db.match.update({
        where: { id },
        data: camelCaseData,
    })
}

export function deleteMatchRepo(id: string) {
    return db.match.delete({ where: { id } })
}

export function findMatchByIdRepo(id: string) {
    return db.match.findUnique({
        where: { id },
        include: { game: true }
    })
}

export function findMatchesByGameRepo(gameId: string) {
    return db.match.findMany({
        where: { gameId },
        include: { game: true },
        orderBy: { createdAt: "desc" }
    })
}

export function findAllMatchesRepo() {
    return db.match.findMany({
        include: { game: true },
        orderBy: { createdAt: "desc" }
    })
}

export function findUserWithCoins(clerkId: string) {
    return db.user.findUnique({
        where: { clerkId },
        include: { coins: true }
    })
}