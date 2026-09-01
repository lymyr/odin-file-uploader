import express from "express";
import session from "express-session";
import path from "node:path"
import sessionConfig from "./lib/sessionConfig.js";
import "./lib/authConfig.js"
import passport from "passport";

process.loadEnvFile()

const app = express()
app.set("views", path.join(import.meta.dirname, 'views'))
app.set("view engine", "ejs")
app.use(session(sessionConfig))
app.use(passport.session())

app.listen(process.env.PORT, () => {
    console.log("Listening to " + process.env.PORT)
})