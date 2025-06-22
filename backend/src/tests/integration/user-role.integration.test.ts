import { Role, User } from '@/models'
import { UserRole } from '@/models/join'

describe('User-Role Integration', () => {
  it('should assign roles to a user and retrieve them', async () => {
    const user = await User.create({
      username: 'integration',
      passwordHash: 'pw',
    })
    const role1 = await Role.create({ name: 'role1' })
    const role2 = await Role.create({ name: 'role2' })

    await user.$add('roles', [role1, role2])

    const foundUser = await User.findByPk(user.id, { include: [Role] })
    expect(foundUser?.roles.length).toBe(2)
    const names = foundUser?.roles.map((r) => r.name)
    expect(names).toContain('role1')
    expect(names).toContain('role2')
  })

  it('should remove a role from a user', async () => {
    const user = await User.create({ username: 'remover', passwordHash: 'pw' })
    const role = await Role.create({ name: 'toremove' })
    await user.$add('roles', role)
    await user.$remove('roles', role)
    const foundUser = await User.findByPk(user.id, { include: [Role] })
    expect(foundUser?.roles.length).toBe(0)
  })

  it('should access through model (UserRole) attributes', async () => {
    const user = await User.create({ username: 'through', passwordHash: 'pw' })
    const role = await Role.create({ name: 'throughrole' })
    await user.$add('roles', role)
    const foundUser = await User.findByPk(user.id, { include: [Role] })
    const userRoleInstance = foundUser?.roles[0]?.UserRole
    expect(userRoleInstance).toBeInstanceOf(UserRole)
    if (!userRoleInstance) throw new Error('UserRole instance not found')
    expect(userRoleInstance.userId).toBe(user.id)
    expect(userRoleInstance.roleId).toBe(role.id)
  })
})
