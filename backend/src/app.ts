import express from 'express'
import sequelize from './config'

const app = express()

app.use(express.json())

// Ruta de prueba
app.get('/ping', (req, res) => {
  res.send('pong')
})

export { app, sequelize }
