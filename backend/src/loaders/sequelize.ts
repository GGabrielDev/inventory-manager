import { Sequelize } from 'sequelize-typescript'

import { dbConfig } from '@/config'
import { Models } from '@/models'

const sequelize = new Sequelize({
  ...dbConfig,
  models: Models,
  define: {
    timestamps: true,
  },
})

export default sequelize
