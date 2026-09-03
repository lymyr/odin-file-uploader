import { prisma } from "../lib/prisma.js"

export const addFolder = async (req, res) => {
    // todo: add folder validation
    const folder = await prisma.folder.create({
        data: {
            name: req.body.name,
            parentId: parseInt(req.body.parentId),
            ownerId: req.user.id
        }
    })
    res.redirect('/')
}

export const viewFolder = async (req, res) => {
    let folder = req.rootFolder

    if (!req.rootFolder) {
        folder = await prisma.folder.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                child: true
            }
        })
    }

    res.render('folderPage', {user: req.user, currentFolder: folder})
}

export const deleteFolder = async (req, res) => {
    await prisma.folder.delete({
        where: {
            id: parseInt(req.body.delFold)
        },
        include: {
            child: true
        }
    })
    res.redirect(`/folder/${req.body.redirectId}`)
}