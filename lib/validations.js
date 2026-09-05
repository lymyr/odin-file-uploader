import { body } from "express-validator"
import { prisma } from "./prisma.js"

class usernamePasswordValidation {
    constructor() {
        throw new Error("Cannot invoke new instance of loginValidation")
    }

    static #username = () => body("username").trim()
        .notEmpty().withMessage("Username shouldn't be empty")
        .isLength({max: 50}).withMessage("Username should not exceed 50 characters")
        .toLowerCase()

    static #password = () => body("password").trim().notEmpty().withMessage("Password should not be empty")

    static #confirmPass = () => body("cpassword").trim().notEmpty().withMessage("Please confirm your password")
        .custom((cpass, {req}) => {
            if (cpass !== req.body.password)
                throw new Error("Passwords do not match")
            return true
        }
    )

    static #regUsername = () => this.#username().bail().custom( async (username) => {
        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })
        if (user != null)
            throw new Error("Username already taken")
    })
    
    static loginValidation = [
        this.#username(),
        this.#password()
    ]

    static registerValidation = [
        this.#regUsername(),
        this.#password(),
        this.#confirmPass()
    ]
}


class folderValidation {
    constructor() {
        throw new Error("Cannot invoke new instance of loginValidation")
    }

    static validName = body("name").trim()
        .isLength({min: 1}).withMessage("Folder name cannot be empty")
        .bail().custom(async (name, {req}) => {
            const duplicateFolder = await prisma.folder.findFirst({
                where: {
                    name: name,
                    parentId: parseInt(req.body.parentId),
                    NOT: {
                        id: {
                            equals: req.body.updateId ? parseInt(req.body.updateId) : -1
                        }
                        
                    }
                }
            })
            if (duplicateFolder != null)
                throw new Error("Folder name is already taken")
        })
    
    
}

export {
    usernamePasswordValidation,
    folderValidation
}