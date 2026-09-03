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
    let updateFolder;
    let files;

    const concQueue = []

    concQueue.push(prisma.file.findMany({
        where: {
            folderId: parseInt(req.params.id)
        }
    }))

    if (!req.rootFolder) {
        concQueue.push(prisma.folder.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                child: true
            }
        }))

        if (req.params.updateId) {
            concQueue.push(prisma.folder.findUnique({
                where: {
                    id: parseInt(req.params.updateId)
                }
            }))
        }
        [files, folder, updateFolder] = await Promise.all(concQueue)
    }
    else
        [files] = await Promise.all(concQueue)
    
    // todo: perhaps add middleware to redirect
    if (folder.ownerId != req.user.id) {
        return res.redirect('/')
    }

    res.render('folderPage', {
        user: req.user, 
        currentFolder: folder, 
        updateFolder: updateFolder,
        files: files
    })
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


export const updateFolder = async (req, res) => {
    await prisma.folder.update({
        where: {
            id: parseInt(req.body.updateId)
        },
        data: {
            name: req.body.name,
            parentId: parseInt(req.body.parentId)
        }
    })

    res.redirect(`/folder/${req.body.parentId}`)
}