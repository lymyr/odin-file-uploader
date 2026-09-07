import { prisma } from "./prisma.js";
import multer from "multer";

export default multer({ dest: 'uploads/', limits: { fileSize: 5000000 }, fileFilter: async (req, file, cb) => {
    const parentFolder = await prisma.folder.findFirst({
        where: { id: parseInt(req.body.parentId) },
        include: {
            child: true,
            file: true,
            shareLink: true
        }
    })
    if (parentFolder.ownerId != req.user.id) 
        cb(new Error("Unauthorized user"), false)
    else {
        req.currentFolder = parentFolder
        cb(null, true)
    }
    
} })