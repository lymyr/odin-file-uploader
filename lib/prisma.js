import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
process.loadEnvFile()

const db_url = process.env.ENVI === 'dev' ? process.env.DATABASE_URL : process.env.PROD_DB
const connectionString = `${db_url}`
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };