import { Router } from "express";
import { checkDate } from "../controllers/shareController.js";
import { viewFolder } from "../controllers/folderController.js";
import { downloadFile } from "../controllers/fileController.js";

const shareRouter = Router()

shareRouter.use("/:id", checkDate)
shareRouter.get("/:id", viewFolder)
shareRouter.post("/:id/download", downloadFile)

export default shareRouter