import { Router } from "express";
import { addFolder, viewFolder } from "../controllers/folderController.js";
import isAuth from "../middleware/isAuth.js";

const folderRouter = Router()

folderRouter.use(isAuth)

folderRouter.post("/add", addFolder)
folderRouter.get("/:id", viewFolder)


export default folderRouter