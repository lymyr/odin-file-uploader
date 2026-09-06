import { Router } from "express";
import { deleteFile, downloadFile, fileError, redirectUpdate, updateFile, uploadFile, viewUpdate } from "../controllers/fileController.js";
import multer from "multer";
import { viewFolder } from "../controllers/folderController.js";

const fileRouter = Router()

const uploadMiddleware = multer({ dest: 'uploads/', limits: { fileSize: 5000000 } })

fileRouter.post('/upload', uploadMiddleware.array('files', 3), uploadFile, viewFolder)
fileRouter.post('/delete', deleteFile)
fileRouter.post('/download', downloadFile)
fileRouter.post('/redirect/update', redirectUpdate)
fileRouter.get('/:folderId/:updateId', viewUpdate)
fileRouter.post('/update', updateFile)

fileRouter.use(fileError, viewUpdate, viewFolder)


export default fileRouter