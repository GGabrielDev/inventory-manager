import { User } from '@/models'

describe('User Model', () => {
  it('should create a user with valid fields', async () => {
    const user = await User.create({
      username: 'testuser',
      passwordHash: 'test',
    })
    expect(user.id).toBeDefined()
    expect(user.username).toBe('testuser')
    expect(user.creationDate).toBeInstanceOf(Date)
    expect(user.updatedOn).toBeInstanceOf(Date)
    expect(user.deletionDate).toBeFalsy()
  })

  it('should hash password with hook', async () => {
    const user = await User.create({
      username: 'hashtest',
      passwordHash: 'plaintext',
    })
    expect(user.passwordHash).not.toBe('plaintext')
    expect(await user.validatePassword('plaintext')).toBe(true)
  })

  it('should enforce unique username', async () => {
    await User.create({ username: 'uniqueuser', passwordHash: 'x' })
    await expect(
      User.create({ username: 'uniqueuser', passwordHash: 'y' })
    ).rejects.toThrow()
  })
})
