import cloudinary from "./cloudinary.js"
import { prisma } from "./prisma.js"

export async function deleteFolder(folderId) {
    const childIds = [folderId]
    const cloudinaryDeleteTasks = []
    const delTasks = []
    while (childIds.length > 0) {
        const id = childIds.shift()
        const folder = await prisma.folder.findUnique({
            where: {
                id: id
            },
            include: {
                child: true,
                file: true,
                shareLink: true
            }
        })

        delTasks.push({
            id: folder.id,
            files: folder.file,
            shareLink: folder.shareLink
        })

        for (const c of folder.child) 
            childIds.push(c.id)
    }

    while (delTasks.length > 0) {
        const currDel = delTasks.pop()
        const q = []
        
        for (const file of currDel.files) {
            q.push(prisma.file.delete({where: { id: file.id }}))
            cloudinaryDeleteTasks.push(file.id)
        }
        if (currDel.shareLink)
            q.push(prisma.shareLink.delete({ where: {id: currDel.shareLink.id}}))
        await Promise.all(q)

        await prisma.folder.delete({
            where: {id: currDel.id}
        })
    }
    await cloudinary.api.delete_resources(cloudinaryDeleteTasks, {
        resource_type: 'raw',
        type: 'private'
    })
}

export function deleteFileTask(id) {
    return [
        cloudinary.uploader.destroy(id, {resource_type: "raw", type: "private"}),
        prisma.file.delete({where: {id: id}})
    ]
}