import { prisma } from "./prisma.js";
import multer, { memoryStorage } from "multer";

export default multer({ storage: memoryStorage(), limits: { fileSize: 5000000 }, fileFilter: async (req, file, cb) => {
    if (file.originalname.length > 200)
        return cb(new Error("File name must not exceed 200 characters"), false)
    
    const parentFolder = await prisma.folder.findFirst({
        where: { id: parseInt(req.body.parentId) },
        include: {
            child: true,
            file: true,
            shareLink: true
        }
    })
    if (parentFolder.ownerId != req.user.id) 
        return cb(new Error("Unauthorized user"), false)
    else {
        req.currentFolder = parentFolder
        cb(null, true)
    }
    
} })