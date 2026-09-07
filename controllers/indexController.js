import { validationResult } from "express-validator"
import { usernamePasswordValidation } from "../lib/validations.js"
import {prisma} from "../lib/prisma.js"
import bcrypt from "bcryptjs"
import passport from "passport"
import isAuth from "../middleware/isAuth.js"

export const getIndex = [
    isAuth,
    async (req, res, next) => {
        const root = await prisma.folder.findFirst({
            where: {
                ownerId: req.user.id,
                parentId: null
            },
            include: { child: true, file: true, shareLink: true }
        })
        req.currentFolder = root
        next()
    }
]

export const getRegister = (req, res) => {
    res.render('register')
}

export const register = [
    usernamePasswordValidation.registerValidation,
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            const hashed = await bcrypt.hash(req.body.password, 10)
            await prisma.user.create({
                data: {
                    username: req.body.username,
                    password: hashed,
                    folders: {
                        create: {
                            name: "root"
                        }
                    }
                }
            })
            return res.render('index')
        }
        res.render('register', {errors: errs.mapped(), body: req.body})
    }
]

export const login = [
    usernamePasswordValidation.loginValidation,
    async (req, res, next) => {
        const errs = validationResult(req)
        if (errs.isEmpty())
            return next()
        res.render('index', {errors: errs.mapped(), body: req.body})
    },
    passport.authenticate('local', {
        failureRedirect: '/',
        successRedirect: '/'
    })
]

export const logout = (req, res, next) => {
    req.logout(async (e) => {
        if (e)
            return next(e)
            
        res.redirect('/')
    })
}