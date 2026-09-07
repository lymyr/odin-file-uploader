import express from "express";
import session from "express-session";
import path from "node:path"
import sessionConfig from "./lib/sessionConfig.js";
import "./lib/authConfig.js"
import passport from "passport";
import indexRouter from "./routes/indexRouter.js";
import folderRouter from "./routes/folderRouter.js";
import fileRouter from "./routes/fileRouter.js";
import shareRouter from "./routes/shareRouter.js";

process.loadEnvFile()

const app = express()
app.set("views", path.join(import.meta.dirname, 'views'))
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(session(sessionConfig))
app.use(passport.session())

app.use('/', indexRouter)
app.use('/folder', folderRouter)
app.use('/file', fileRouter)
app.use('/share', shareRouter)

app.listen(process.env.PORT, () => {
    console.log("Listening to " + process.env.PORT)
})