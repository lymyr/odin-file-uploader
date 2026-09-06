import { prisma } from "../lib/prisma.js"

export default async function (req, res, next) {
    if (!req.currentFolder) {
        const id = req.body?.parentId || req.body?.redirectId || req.params.id || req.params.folderId
        req.currentFolder = await prisma.folder.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                child: true,
                file: true
            }
        })

        if (req.currentFolder.ownerId != req.user.id)
            return res.redirect('/')
    }

    if (req.params.updateId || req.body?.id) {
        const fileId = req.body?.id ? req.body.id : req.params.updateId
        const updateFile = await prisma.file.findUnique({
            where: {
                id: fileId,
                folder: {
                    ownerId: req.user.id
                }
            }
        })
        req.updateFile = updateFile

        if (req.updateFile == null)
            return res.redirect('/')
    }
    next()
}