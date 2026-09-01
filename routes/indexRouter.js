import { Router } from "express";
import { getIndex, getRegister, login, logout, register } from "../controllers/indexController.js";

const indexRouter = Router()

indexRouter.get('/', getIndex)
indexRouter.get('/register', getRegister)
indexRouter.post('/register', register)
indexRouter.post('/login', login)
indexRouter.post('/logout', logout)

export default indexRouter