import { User } from '@/models'
import * as changeLogger from '@/utils/change-logger'

describe('User Model', () => {
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

  it('should create a user with valid fields', async () => {
    const user = await User.create(
      {
        username: 'testuser',
        passwordHash: 'test',
      },
      { userId: systemUser.id }
    )
    expect(user.id).toBeDefined()
    expect(user.username).toBe('testuser')
    expect(user.creationDate).toBeInstanceOf(Date)
    expect(user.updatedOn).toBeInstanceOf(Date)
    expect(user.deletionDate).toBeFalsy()
    expect(logHookSpy).toHaveBeenCalledWith(
      'create',
      expect.any(User),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: 'User',
        modelId: expect.any(Number),
      })
    )
  })

  it('should hash password with hook', async () => {
    const user = await User.create(
      {
        username: 'hashtest',
        passwordHash: 'plaintext',
      },
      { userId: systemUser.id }
    )
    expect(user.passwordHash).not.toBe('plaintext')
    expect(await user.validatePassword('plaintext')).toBe(true)
    expect(logHookSpy).toHaveBeenCalledWith(
      'create',
      expect.any(User),
      expect.objectContaining({ userId: systemUser.id })
    )
  })

  it('should enforce unique username', async () => {
    await User.create(
      { username: 'uniqueuser', passwordHash: 'x' },
      { userId: systemUser.id }
    )
    await expect(
      User.create(
        { username: 'uniqueuser', passwordHash: 'y' },
        { userId: systemUser.id }
      )
    ).rejects.toThrow()
    expect(logHookSpy).toHaveBeenCalledWith(
      'create',
      expect.any(User),
      expect.objectContaining({ userId: systemUser.id })
    )
  })
})
