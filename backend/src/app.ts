import express from 'express'

import { BASE_URL } from './config'
import mainRouter from './routes'

const app = express()

app.use(express.json())
app.use(mainRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running at http://${BASE_URL}:${PORT}`)
})
