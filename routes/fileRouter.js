import { Router } from "express";
import { deleteFile, downloadFile, redirectUpdate, updateFile, uploadFile, viewUpdate } from "../controllers/fileController.js";
import multer from "multer";

const fileRouter = Router()

const uploadMiddleware = multer({ dest: 'uploads/' })

fileRouter.post('/upload', uploadMiddleware.array('files', 15), uploadFile)
fileRouter.post('/delete', deleteFile)
fileRouter.post('/download', downloadFile)
fileRouter.post('/redirect/update', redirectUpdate)
fileRouter.get('/:folderId/:updateId', viewUpdate)
fileRouter.post('/update', updateFile)

export default fileRouter