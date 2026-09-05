import { Router } from "express";
import { addFolder, deleteFolder, updateFolder, viewFolder } from "../controllers/folderController.js";
import isAuth from "../middleware/isAuth.js";

const folderRouter = Router()

folderRouter.use(isAuth)

folderRouter.post("/add", addFolder, viewFolder)
folderRouter.get("/:id", viewFolder)
folderRouter.post('/delete', deleteFolder)
folderRouter.get('/:id/update/:updateId', viewFolder)
folderRouter.post('/update', updateFolder, viewFolder)


export default folderRouter