import { Permission, Role, User } from '@/models'
import populateAdminAndPermissions from '@/services/populateAdmin'

jest.mock('@/models', () => ({
  Permission: {
    bulkCreate: jest.fn(),
    findAll: jest.fn(),
  },
  Role: {
    findOrCreate: jest.fn(),
    findOne: jest.fn(),
  },
  User: {
    findOrCreate: jest.fn(),
    findOne: jest.fn(),
  },
}))

describe('populateAdminAndPermissions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const mockRole = { id: 1 }
    ;(Role.findOrCreate as jest.Mock).mockResolvedValue([mockRole, true])
    ;(Role.findOne as jest.Mock).mockResolvedValue(mockRole)
    ;(User.findOrCreate as jest.Mock).mockResolvedValue([
      { id: 0, username: 'admin', roleId: mockRole.id },
      true,
    ])
    ;(User.findOne as jest.Mock).mockResolvedValue({
      id: 0,
      username: 'admin',
      roleId: mockRole.id,
    })
    ;(Permission.findAll as jest.Mock).mockResolvedValue([
      { name: 'create_category' },
      { name: 'get_user' },
      // Add more expected permissions here
    ])
  })

  it('should create permissions', async () => {
    await populateAdminAndPermissions()

    expect(Permission.bulkCreate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'create_category' }),
        expect.objectContaining({ name: 'get_user' }),
        // Add more expected permissions here
      ]),
      { ignoreDuplicates: true, userId: 0 }
    )

    const permissions = await Permission.findAll()
    expect(permissions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'create_category' }),
        expect.objectContaining({ name: 'get_user' }),
        // Add more expected permissions here
      ])
    )
  })

  it('should create an admin role', async () => {
    await populateAdminAndPermissions()

    expect(Role.findOrCreate).toHaveBeenCalledWith({
      where: { name: 'admin' },
      defaults: { description: 'Administrator role with full permissions' },
      userId: 0,
    })

    const role = await Role.findOne({ where: { name: 'admin' } })
    expect(role).toEqual(expect.objectContaining({ id: 1 }))
  })

  it('should create an admin user', async () => {
    await populateAdminAndPermissions()

    expect(User.findOrCreate).toHaveBeenCalledWith({
      where: { username: 'admin' },
      defaults: {
        passwordHash: 'admin',
        roleId: 1, // Assuming the mock role ID is 1
      },
      userId: 0, // Include userId if it's part of the options
    })

    const user = await User.findOne({ where: { username: 'admin' } })
    expect(user).toEqual(
      expect.objectContaining({
        id: 0,
        username: 'admin',
        roleId: 1,
      })
    )
  })
})
