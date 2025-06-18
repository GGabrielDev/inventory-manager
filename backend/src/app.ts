import express from 'express'

const app = express()

app.use(express.json())

// Ruta de prueba
app.get('/ping', (req, res) => {
  res.send('pong')
})

export default app
