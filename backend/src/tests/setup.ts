import sequelize from '@/loaders/sequelize'

// Una sola instancia global que todos los tests usan
beforeAll(async () => {
  await sequelize.sync({ force: true }) // garantiza que esté todo limpio
})

// Despues de cada test individual
afterEach(async () => {
  // Limpia todas las tablas sin reiniciar la conexión
  for (const model of Object.values(sequelize.models)) {
    await model.destroy({ where: {}, truncate: true, force: true })
  }
})

// Cerrar conexión solo al final de todos los tests
afterAll(async () => {
  await sequelize.close()
})
