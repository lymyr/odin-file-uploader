import { prisma } from "../lib/prisma.js"
import { deleteFolder as helperDeleteFolder } from "../lib/helpers.js"
import { folderValidation } from "../lib/validations.js"
import { validationResult } from "express-validator"

export const addFolder = [
    folderValidation.validName,
    async (req, res, next) => {
        const err = validationResult(req)

        if (err.isEmpty()) {
            await prisma.folder.create({
                data: {
                    name: req.body.name,
                    parentId: parseInt(req.body.parentId),
                    ownerId: req.user.id
                }
            })
        } else
            req.errors = err.mapped()
        next()
    }
]

export const viewFolder = async (req, res) => {
    let folder = req.rootFolder
    let updateFolder;

    const concQueue = []

    let id = req.body?.parentId || req.params.id
    if (!req.rootFolder) {
        concQueue.push(prisma.folder.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                child: true,
                file: true
            }
        }))

        if (req.params.updateId) {
            concQueue.push(prisma.folder.findUnique({
                where: {
                    id: parseInt(req.params.updateId)
                }
            }))
        }
        [folder, updateFolder] = await Promise.all(concQueue)
    }
    
    // todo: perhaps add middleware to redirect
    if (folder.ownerId != req.user.id) {
        return res.redirect('/')
    }

    res.render('folderPage', {
        user: req.user, 
        currentFolder: folder, 
        updateFolder: updateFolder,
        errors: req.errors
    })
}

export const deleteFolder = async (req, res) => {
    await helperDeleteFolder(parseInt(req.body.delFold))
    res.redirect(`/folder/${req.body.redirectId}`)
}


export const updateFolder = [
    folderValidation.validName,
    async (req, res, next) => {
        const err = validationResult(req)
        if (err.isEmpty()) {
            await prisma.folder.update({
                where: {
                    id: parseInt(req.body.updateId)
                },
                data: {
                    name: req.body.name,
                    parentId: parseInt(req.body.parentId)
                }
            })
        } else 
            req.errors = err.mapped()
        next()
    }
]