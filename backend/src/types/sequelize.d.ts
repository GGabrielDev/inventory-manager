import 'sequelize'
import 'sequelize-typescript'

import { User } from '@/models'

declare module 'sequelize' {
  interface CreateOptions {
    userId?: User['id']
  }
  interface UpdateOptions {
    userId?: User['id']
  }
  interface DestroyOptions {
    userId?: User['id']
  }
}
