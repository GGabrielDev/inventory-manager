import { sequelize } from '../app'

// Antes de correr cualquier prueba
beforeAll(async () => {
  await sequelize.sync({ force: true }) // Primera sincronización completa
})

// Antes de cada test individual
beforeEach(async () => {
  // Borrar todos los registros de todas las tablas sin reiniciar la estructura
  for (const model of Object.values(sequelize.models)) {
    await model.destroy({ where: {}, truncate: true })
  }
})

// Cerrar conexión solo al final de todos los tests
afterAll(async () => {
  await sequelize.close()
})
