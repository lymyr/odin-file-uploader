import { Router } from "express";
import { addFolder, deleteFolder, shareFolder, updateFolder, viewFolder } from "../controllers/folderController.js";
import isAuth from "../middleware/isAuth.js";
import isOwner from "../middleware/isOwner.js";

const folderRouter = Router()

folderRouter.use('/{:id}', isAuth, isOwner)

folderRouter.post("/add", addFolder, viewFolder)
folderRouter.get("/:id", viewFolder)
folderRouter.post('/delete', deleteFolder)
folderRouter.get('/:id/update/:updateId', viewFolder)
folderRouter.post('/update', updateFolder, viewFolder)
folderRouter.post('/share', shareFolder, viewFolder)

export default folderRouter