import { validationResult } from "express-validator"
import {registerValidation, loginValidation } from "../lib/validations.js"
import {prisma} from "../lib/prisma.js"
import bcrypt from "bcryptjs"
import passport from "passport"

export const getIndex = (req, res) => {
    if (req.isAuthenticated())
        return res.render('index', {username: req.user.username})
    res.render('index')
}

export const getRegister = (req, res) => {
    res.render('register')
}

export const register = [
    registerValidation,
    async (req, res) => {
        const errs = validationResult(req)
        if (errs.isEmpty()) {
            const hashed = await bcrypt.hash(req.body.password, 10)
            await prisma.user.create({
                data: {
                    username: req.body.username,
                    password: hashed
                }
            })
            return res.render('index')
        }
        res.render('register', {errors: errs.mapped(), body: req.body})
    }
]

export const login = [
    loginValidation,
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