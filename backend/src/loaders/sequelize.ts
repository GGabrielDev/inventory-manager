import { Sequelize } from 'sequelize-typescript'
import { Models } from '@/models'
import { dbConfig } from '@/config'

const sequelize = new Sequelize({
  ...dbConfig,
  models: Models,
})

export default sequelize
