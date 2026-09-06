import { prisma } from "../lib/prisma.js"

export default async function (req, res, next) {
    if (!req.currentFolder) {
        const id = req.body?.parentId || req.body?.redirectId || req.params.id
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
    next()
}