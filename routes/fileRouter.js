import { Router } from "express";
import { deleteFile, downloadFile, fileError, redirectUpdate, updateFile, uploadFile, viewUpdate } from "../controllers/fileController.js";
import { viewFolder } from "../controllers/folderController.js";
import isOwner from "../middleware/isOwner.js";
import isAuth from "../middleware/isAuth.js";
import multer from "../lib/multer.js";

const fileRouter = Router()

fileRouter.use('/{:folderId}{/:updateId}', isAuth) 

fileRouter.post('/upload', multer.array('files', 3), uploadFile, viewFolder)
fileRouter.use(isOwner)
fileRouter.post('/delete', deleteFile)
fileRouter.post('/download', downloadFile)
fileRouter.post('/redirect/update', redirectUpdate)
fileRouter.get('/:folderId/:updateId', viewUpdate)
fileRouter.post('/update', updateFile)

fileRouter.use(fileError, viewUpdate, viewFolder)


export default fileRouter