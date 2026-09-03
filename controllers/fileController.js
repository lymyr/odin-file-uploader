import { prisma } from "../lib/prisma.js"

export const uploadFile = async (req, res) => {
    const fileList = req.files.map(file => {
        return {
            path: file.destination,
            id: file.filename,
            name: file.originalname,
            bytes: parseInt(file.size),
            folderId: parseInt(req.body.currentFolder)
        }
    })

    await prisma.file.createMany({
        data: fileList
    })

    res.redirect(`/folder/${req.body.currentFolder}`)
}