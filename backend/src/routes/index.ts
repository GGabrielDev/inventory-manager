import express from 'express'

import { authenticateToken } from '@/middlewares/authentication'

import authRouter from './auth'
import permissionRouter from './permission'
import roleRouter from './role'

const mainRouter = express.Router()

mainRouter.use('/auth', authRouter)

// Authentication Required
mainRouter.use(authenticateToken)
mainRouter.use('/roles', roleRouter)
mainRouter.use('/permissions', permissionRouter)

export default mainRouter
