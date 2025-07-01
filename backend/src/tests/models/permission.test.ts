import { Permission } from '@/models'

describe('Permission Model', () => {
  it('should create a permission', async () => {
    const permission = await Permission.create({
      name: 'readEntity',
      description: 'Allows reading entities',
    })

    expect(permission).toBeDefined()
    expect(permission.id).toBeDefined()
    expect(permission.name).toBe('readEntity')
    expect(permission.description).toBe('Allows reading entities')
  })

  it('should not allow duplicate permission names', async () => {
    await Permission.create({
      name: 'writeEntity',
      description: 'Allows writing entities',
    })

    await expect(
      Permission.create({
        name: 'writeEntity',
        description: 'Duplicate permission',
      })
    ).rejects.toThrow()
  })

  it('should require a name and description', async () => {
    await expect(
      Permission.create({
        name: '',
        description: '',
      })
    ).rejects.toThrow(/Validation error/) // Check for validation error
  })
})
