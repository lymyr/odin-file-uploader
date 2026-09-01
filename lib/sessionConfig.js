import { PrismaSessionStore } from "@quixo3/prisma-session-store"
import {prisma} from "./prisma.js"

process.loadEnvFile()

export default {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 *24 * 3
    },
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true
        }
    )
}