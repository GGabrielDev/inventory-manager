import express, { Request, Response, Router } from 'express'

import { UserController } from '@/controllers'
import { authenticateToken } from '@/middlewares/authentication'

const authRouter: Router = express.Router()

authRouter.post(
  '/login',
  async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body

    // Validate request body
    if (!username) {
      res.status(400).json({ error: 'Username is required' })
      return
    }
    if (!password) {
      res.status(400).json({ error: 'Password is required' })
      return
    }

    try {
      const token = await UserController.login(username, password)
      res.json({ token })
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' })
      }
    }
  }
)

// Validate token endpoint
authRouter.get(
  '/validate',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    // If we reach here, the token is valid (authenticateToken middleware passed)
    res.json({ valid: true })
  }
)

// Get current user's data (no permissions required, only authentication)
authRouter.get(
  '/me',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId
      if (typeof userId !== 'number') {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const user = await UserController.getUserById(userId)
      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      res.json(user)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' })
      }
    }
  }
)

export default authRouter
