import { prisma } from "../lib/prisma.js"
import { deleteFileTask } from "../lib/helpers.js"
import { fileVadiation } from "../lib/validations.js"
import { validationResult } from "express-validator"
import cloudinary from "../lib/cloudinary.js"
import { Readable } from "node:stream"
import pLimit from "p-limit"


export const uploadFile = async (req, res) => {
    if (req.files.length == 0)
        throw new Error("Please upload a file")
    
    const limit = pLimit(10)
    const uploadedFiles = await Promise.all(req.files.map(file => {
        return limit(async () => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({
                    resource_type: "raw",
                    asset_folder: "/odin_file_uploader",
                    type: 'private',
                },
                (error, result) => {
                    if (error)
                        return reject(error)
                    return resolve(result)
                }).end(file.buffer)
            })
        })
    }))

    const fileList = uploadedFiles.map((file, i) => {
        return {
            id: file.public_id,
            name: req.files[i].originalname,
            bytes: file.bytes,
            folderId: parseInt(req.body.parentId)
        }
    })

    await prisma.file.createMany({data: fileList})

    res.redirect(`/folder/${req.body.parentId}`)
}

export const deleteFile = async (req, res) => {
    await Promise.all(deleteFileTask(req.body.fileId))
    res.redirect(`/folder/${req.body.redirectId}`)
}

export const downloadFile = async (req, res) => {
    const downloadLink = cloudinary.utils.private_download_url(req.body.fileId, "", {
        resource_type: "raw",
        type: "private",
        attachment: true,
    })

    const downloadedFile = await fetch(downloadLink)
    if (!downloadedFile.ok)
        throw new Error("Failed fetching from cloudinary")

    res.setHeader(
        'Content-Disposition',
        `attachment; filename=${req.body.fileName}`
    )
    const cType = downloadedFile.headers.get('content-type')
    const cLength = downloadedFile.headers.get('content-length')
    if (cType) res.setHeader('Content-Type', cType)
    if (cLength) res.setHeader('Content-Length', cLength)
    
    return Readable.fromWeb(downloadedFile.body).pipe(res)
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