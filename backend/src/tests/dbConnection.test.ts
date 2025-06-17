import { sequelize } from '../app'

describe('Database connection', () => {
  it('should authenticate successfully', async () => {
    await expect(sequelize.authenticate()).resolves.toBeUndefined()
  })
})
