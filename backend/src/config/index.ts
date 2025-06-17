import 'reflect-metadata'
import { Sequelize } from 'sequelize-typescript'
import { config as loadEnv } from 'dotenv'
import path from 'path'
import fs from 'fs'

// Cargar el archivo de entorno correcto
const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
loadEnv({ path: envPath })

// Ruta absoluta a los modelos
const modelsDir = path.resolve(__dirname, '..', 'models')

// Recursivamente recoger clases exportadas desde archivos .ts/.js
function collectModelClasses(dir: string): any[] {
  const classes: any[] = []
  for (const file of fs.readdirSync(dir)) {
    const absolute = path.join(dir, file)
    if (fs.statSync(absolute).isDirectory()) {
      classes.push(...collectModelClasses(absolute))
    } else if (absolute.endsWith('.ts') || absolute.endsWith('.js')) {
      const mod = require(absolute)
      for (const key in mod) {
        const exported = mod[key]
        if (typeof exported === 'function') {
          classes.push(exported)
        }
      }
    }
  }
  return classes
}

const modelClasses = collectModelClasses(modelsDir)

const isSQLite = process.env.DB_DIALECT === 'sqlite'

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT as any,
  ...(isSQLite
    ? { storage: process.env.DB_STORAGE }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }),
  logging: false,
  models: modelClasses,
})

export default sequelize
