import { Role, User } from '@/models'
import * as changeLogger from '@/utils/change-logger'

describe('Role Model', () => {
  let systemUser: User
  let logHookSpy: jest.SpyInstance

  beforeEach(async () => {
    systemUser = await User.create(
      {
        id: 0,
        username: 'systemUser',
        passwordHash: 'password',
      },
      { userId: 0 }
    )
    logHookSpy = jest
      .spyOn(changeLogger, 'logHook')
      .mockResolvedValue(undefined)
  })

  afterEach(() => {
    if (logHookSpy) logHookSpy.mockRestore()
  })

  it('should create a role with valid fields', async () => {
    const role = await Role.create(
      {
        name: 'admin',
        description: 'Administrator',
      },
      { userId: systemUser.id }
    )
    expect(role.id).toBeDefined()
    expect(role.name).toBe('admin')
    expect(role.creationDate).toBeInstanceOf(Date)
    expect(role.updatedOn).toBeInstanceOf(Date)
    expect(role.deletionDate).toBeFalsy()
    expect(logHookSpy).toHaveBeenCalledWith(
      'create',
      expect.any(Role),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: 'Role',
        modelId: expect.any(Number),
      })
    )
  })

  it('should enforce unique role name', async () => {
    await Role.create(
      { name: 'uniqueRole', description: 'desc' },
      { userId: systemUser.id }
    )
    await expect(
      Role.create(
        { name: 'uniqueRole', description: 'other desc' },
        { userId: systemUser.id }
      )
    ).rejects.toThrow()
    expect(logHookSpy).toHaveBeenCalledWith(
      'create',
      expect.any(Role),
      expect.objectContaining({ userId: systemUser.id })
    )
  })
})
