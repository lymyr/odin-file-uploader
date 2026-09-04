import { Router } from "express";
import { deleteFile, uploadFile } from "../controllers/fileController.js";
import multer from "multer";

const fileRouter = Router()

const uploadMiddleware = multer({ dest: 'uploads/' })

fileRouter.post('/upload', uploadMiddleware.array('files', 15), uploadFile)
fileRouter.post('/delete', deleteFile)

export default fileRouter