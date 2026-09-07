import { prisma } from "../lib/prisma.js"
import path from "node:path"
import { deleteFileTask } from "../lib/helpers.js"
import { fileVadiation } from "../lib/validations.js"
import { validationResult } from "express-validator"

export const uploadFile = async (req, res) => {
    if (req.files.length == 0)
        throw new Error("Please upload a file")

    const fileList = req.files.map(file => {
        if (file.originalname.length > 200)
            throw new Error("File name must not exceed 200 characters")
        return {
            path: file.destination,
            id: file.filename,
            name: file.originalname,
            bytes: parseInt(file.size),
            folderId: parseInt(req.body.parentId)
        }
    })

    await prisma.file.createMany({
        data: fileList
    })

    res.redirect(`/folder/${req.body.parentId}`)
}

export const deleteFile = async (req, res) => {
    await Promise.all(deleteFileTask(req.body.fileId))
    res.redirect(`/folder/${req.body.redirectId}`)
}

export const downloadFile = async (req, res) => {
    res.download(`${path.join(import.meta.dirname, `../uploads/${req.body.fileId}`)}`, req.body.fileName)
}

export const viewUpdate = async (req, res, next) => {
    if (req.errors && !req.errors.update)
        return next()

    const fileId = req.body?.id ? req.body.id : req.params.updateId
    const folder = req.currentFolder
    const updateFile = await prisma.file.findFirstOrThrow({
        where: {
            id: fileId,
            folder: {
                ownerId: req.user.id
            }
        }
    })

    res.render('folderPage', {
        user: req.user, 
        currentFolder: folder, 
        updateFile: updateFile,
        errors: req.errors
    })
}

export const updateFile = [
    fileVadiation.name,
    async (req, res) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            const e = new Error(err.mapped().fileName.msg)
            e.update = true
            throw e
        }
            
        await prisma.file.update({
            where: {id: req.body.id},
            data: {
                name: req.body.fileName,
                folderId: parseInt(req.body.parentId)
            }
        })
        res.redirect(`/folder/${req.body.parentId}`)
    }
]

export const fileError = (err, req, res, next) => {
    if (err.code == 'LIMIT_FILE_SIZE')
        err.message = 'File should not exceed 5mb'
    else if (err.code == 'LIMIT_UNEXPECTED_FILE')
        err.message = 'Please limit the number of files to 3'

    req.errors = {
        files: {
            msg: err.message
        },
        update: err.update
    }
    next()
}