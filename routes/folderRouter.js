import { Router } from "express";
import { addFolder, deleteFolder, viewFolder } from "../controllers/folderController.js";
import isAuth from "../middleware/isAuth.js";

const folderRouter = Router()

folderRouter.use(isAuth)

folderRouter.post("/add", addFolder)
folderRouter.get("/:id", viewFolder)
folderRouter.post('/delete', deleteFolder)

export default folderRouter