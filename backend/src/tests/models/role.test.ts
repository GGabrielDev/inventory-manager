import { Role } from '@/models'

describe('Role Model', () => {
  it('should create a role with valid fields', async () => {
    const role = await Role.create({ name: 'admin' })
    expect(role.id).toBeDefined()
    expect(role.name).toBe('admin')
    expect(role.creationDate).toBeInstanceOf(Date)
    expect(role.updatedOn).toBeInstanceOf(Date)
    expect(role.deletionDate).toBeFalsy()
  })

  it('should enforce unique name', async () => {
    await Role.create({ name: 'uniqueRole' })
    await expect(Role.create({ name: 'uniqueRole' })).rejects.toThrow()
  })
})
