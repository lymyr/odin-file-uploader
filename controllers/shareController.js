import { format, isBefore } from "date-fns";
import { prisma } from "../lib/prisma.js";

export const checkDate = async (req, res, next) => {
    const folderId = parseInt(req.params.id)
    const folder = await prisma.folder.findFirstOrThrow({
        where: {id: folderId },
        include: {
            file: true,
            shareLink: true
        }
    })

    if (
        folder.shareLink != null && 
        isBefore(folder.shareLink.expire, new Date(format(new Date(), 'yyyy-MM-dd')))
    ) {
        await prisma.shareLink.delete({ where: { id: folderId }})
        throw new Error("Link has expired")
    } else if (folder.shareLink == null)
        throw new Error("Link not found")
    
    req.currentFolder = folder
    req.share = true
    next()
}