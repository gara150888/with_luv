import db from "@/lib/db"
import type { Prisma } from "@/lib/generated/prisma/client"

export async function findGameById(id: string) {
  return db.game.findUnique({ where: { id } })
}

export async function findGames(where?: Prisma.GameWhereInput) {
  return db.game.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })
}

export async function insertGame(data: {
  name: string
  description: string
  image: string
  bannerImage: string
  modeType: "BR" | "LW" | "CS"
  status: boolean
}) {
  return db.game.create({ data })
}

export async function modifyGame(id: string, data: Prisma.GameUpdateInput) {
  return db.game.update({ where: { id }, data })
}

export async function removeGame(id: string) {
  return db.game.delete({ where: { id } })
}