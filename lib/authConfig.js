import passport from "passport";
import { Strategy } from "passport-local";
import {prisma} from "./prisma.js"
import bcrypt from "bcryptjs";

passport.use(new Strategy( async (username, password, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        if (!user) 
            return done(null, false, {message: "Username is not registered"})
        const match = await bcrypt.compare(password, user.password)
        if (!match)
            return done(null, false, {message: "Incorrect password"})
        done(null, user)
    } 
    catch (e) {
        done(e)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
}) 

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ 
            where: {id: id} 
        })
        done(null, user)
    } catch(e) {
        done(e)
    }
})