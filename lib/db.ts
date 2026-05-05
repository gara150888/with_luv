import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as { db: PrismaClient | undefined; };

const db = globalForPrisma.db ||
  new PrismaClient({
    adapter: new PrismaPg({ connectionString })
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;

export default db;