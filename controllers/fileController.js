import { prisma } from "../lib/prisma.js"
import fs from 'node:fs/promises'
import path from "node:path"

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

export const deleteFile = async (req, res) => {
    try {
        const q = []
        q.push(fs.unlink(`${path.join(import.meta.dirname, `../uploads/${req.body.fileId}`)}`))
        q.push(prisma.file.delete({where: {id: req.body.fileId}}))
        await Promise.all(q)
    }
    catch(e) {
        throw e
    }
    res.redirect(`/folder/${req.body.redirectId}`)
}

export const downloadFile = async (req, res) => {
    res.download(`${path.join(import.meta.dirname, `../uploads/${req.body.fileId}`)}`, req.body.fileName)
}