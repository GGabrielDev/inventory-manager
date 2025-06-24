import 'sequelize'

declare module 'sequelize' {
  interface CreateOptions {
    userId?: number
  }
  interface UpdateOptions {
    userId?: number
  }
  interface DestroyOptions {
    userId?: number
  }
}
