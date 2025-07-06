import express from 'express'

import { authenticateToken } from '@/middlewares/authentication'

import authRouter from './auth'
import permissionRouter from './permission'
import roleRouter from './role'
import userRouter from './user'

const mainRouter = express.Router()

mainRouter.use('/auth', authRouter)

// Authentication Required
mainRouter.use(authenticateToken)
mainRouter.use('/roles', roleRouter)
mainRouter.use('/permissions', permissionRouter)
mainRouter.use('/users', userRouter)

export default mainRouter
