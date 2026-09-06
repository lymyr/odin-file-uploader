import { prisma } from "../lib/prisma.js"
import { deleteFolder as helperDeleteFolder } from "../lib/helpers.js"
import { folderValidation } from "../lib/validations.js"
import { validationResult } from "express-validator"

export const addFolder = [
    folderValidation.validName,
    async (req, res) => {
        const err = validationResult(req)

        if (err.isEmpty()) {
            await prisma.folder.create({
                data: {
                    name: req.body.name,
                    parentId: parseInt(req.body.parentId),
                    ownerId: req.user.id
                }
            })
            return res.redirect(`/folder/${req.body.parentId}`)
        } 

        req.errors = err.mapped()
        next()
    }
]

export const viewFolder = async (req, res) => {
    const folder = req.currentFolder ? req.currentFolder : await prisma.folder.findFirstOrThrow({ 
        where: {
            parentId: null,
            ownerId: req.user.id
        },
        include: {
            child: true,
            file: true
        }
    })
    const updateId = req.params.updateId ? req.params.updateId : req.updateId ? req.updateId : null
    const updateFolder =  updateId ? await prisma.folder.findFirstOrThrow({
            where: {
                id: parseInt(updateId),
                ownerId: req.user.id
            }
        }) : null
        
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
                    id: parseInt(req.body.updateId),
                    ownerId: req.user.id
                },
                data: {
                    name: req.body.name,
                    parentId: parseInt(req.body.parentId)
                }
            })
            return res.redirect(`/folder/${req.body.parentId}`)
        }

        req.errors = err.mapped()
        req.updateId = req.body.updateId
        next()
    }
]