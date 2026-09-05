import { prisma } from "../lib/prisma.js"
import fs from 'node:fs/promises'
import path from "node:path"
import { deleteFileTask } from "../lib/helpers.js"

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
    await Promise.all(deleteFileTask(req.body.fileId))
    res.redirect(`/folder/${req.body.redirectId}`)
}

export const downloadFile = async (req, res) => {
    res.download(`${path.join(import.meta.dirname, `../uploads/${req.body.fileId}`)}`, req.body.fileName)
}

export const redirectUpdate = async (req, res) => {
    res.redirect(`/file/${req.body.redirectId}/${req.body.fileId}`)
}

export const viewUpdate = async (req, res) => {
    const q = []
    q.push(prisma.file.findFirstOrThrow({
        where: {id: req.params.updateId}
    }))
    q.push(prisma.folder.findFirstOrThrow({
        where: {id: parseInt(req.params.folderId)},
        include: {child: true, file: true}
    }))
    const [updateFile, folder] = await Promise.all(q)

    res.render('folderPage', {
        user: req.user, 
        currentFolder: folder, 
        updateFile: updateFile
    })
}

export const updateFile = async (req, res) => {
    console.log("in")
    await prisma.file.update({
        where: {id: req.body.id},
        data: {
            name: req.body.fileName,
            folderId: parseInt(req.body.parentId)
        }
    })
    res.redirect(`/folder/${req.body.parentId}`)
}