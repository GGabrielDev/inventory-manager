import express from 'express'

import authRouter from './auth'

const mainRouter = express.Router()

mainRouter.use('/auth', authRouter)

export default mainRouter

// src/app.ts
import express from 'express'

import { BASE_URL } from './config/env'
import mainRouter from './routes/mainRouter'

const app = express()

app.use(express.json())
app.use(mainRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running at http://${BASE_URL}:${PORT}`)
})
