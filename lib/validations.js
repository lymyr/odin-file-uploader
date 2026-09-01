import { body } from "express-validator"
import { prisma } from "./prisma.js"

const username = () => body("username").trim()
    .notEmpty().withMessage("Username shouldn't be empty")
    .isLength({max: 50}).withMessage("Username should not exceed 50 characters")

const password = () => body("password").trim().notEmpty().withMessage("Password should not be empty")

const confirmPass = () => body("cpassword").trim().notEmpty().withMessage("Please confirm your password")
    .custom((cpass, {req}) => {
        if (cpass !== req.body.password)
            throw new Error("Passwords do not match")
        return true
    }
)

const regUsername = () => username().bail().custom( async (username) => {
    const user = await prisma.user.findFirst({
        where: {
            username: username
        }
    })
    if (user != null)
        throw new Error("Username already taken")
})


const loginValidation = [
    username(),
    password(),
]
const registerValidation = [
    regUsername(),
    password(),
    confirmPass(),
]

export {loginValidation, registerValidation}