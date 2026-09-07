import { prisma } from "./prisma.js"
import fs from 'node:fs/promises'
import path from "node:path"

// todo: research ways to make this more efficient
export async function deleteFolder(folderId) {
    const childIds = [folderId]
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
            files: folder.file
        })

        for (const c of folder.child) 
            childIds.push(c.id)
    }

    while (delTasks.length > 0) {
        const currDel = delTasks.pop()
        const q = []
        
        for (const file of currDel.files) {
            q.push(...deleteFileTask(file.id))
        }
        await Promise.all(q)

        await prisma.folder.delete({
            where: {id: currDel.id}
        })
    }
}

export function deleteFileTask(id) {
    return [
        fs.unlink(`${path.join(import.meta.dirname, `../uploads/${id}`)}`),
        prisma.file.delete({where: {id: id}})
    ]
}