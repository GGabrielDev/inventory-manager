import express from 'express'

import { authenticateToken } from '@/middlewares/authentication'

import authRouter from './auth'
import permissionRouter from './permission'

const mainRouter = express.Router()

mainRouter.use('/auth', authRouter)

// Authentication Required
mainRouter.use(authenticateToken)
mainRouter.use('/permissions', permissionRouter)

export default mainRouter
