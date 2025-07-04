import { Role, User } from '@/models'

interface PaginationOptions {
  page: number
  pageSize: number
}

interface PaginatedResult<T> {
  data: T[]
  total: number
  totalPages: number
  currentPage: number
}

export class UserController {
  // Create a new user with roles
  static async createUser(
    username: User['username'],
    password: User['passwordHash'],
    userId: User['id'],
    roleIds: number[] = []
  ): Promise<User> {
    if (!username) {
      throw new Error('Validation error: Username is required')
    }
    if (!password) {
      throw new Error('Validation error: Password is required')
    }
    if (typeof userId !== 'number' || userId < 0) {
      throw new Error('Invalid userId')
    }

    const user = await User.create(
      { username, passwordHash: password },
      { userId }
    )

    if (roleIds.length > 0) {
      const roles = await Role.findAll({ where: { id: roleIds } })
      await user.$set(User.RELATIONS.ROLES, roles, { userId })
    }

    return user
  }

  // Get a user by ID
  static async getUserById(userId: User['id']): Promise<User | null> {
    if (typeof userId !== 'number' || isNaN(userId)) {
      throw new Error('Invalid userId')
    }

    return User.findByPk(userId, {
      include: [User.RELATIONS.ROLES, User.RELATIONS.CHANGELOGS],
    })
  }

  // Get all users with pagination
  static async getAllUsers({
    page,
    pageSize,
  }: PaginationOptions): Promise<PaginatedResult<User>> {
    if (page < 1 || pageSize < 1) {
      return {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: page,
      }
    }

    const offset = (page - 1) * pageSize
    const { count, rows } = await User.findAndCountAll({
      offset,
      limit: pageSize,
      include: [User.RELATIONS.ROLES],
    })

    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
    }
  }

  // Update a user and their roles
  static async updateUser(
    userId: User['id'],
    updates: Partial<User>,
    actionUserId: User['id'],
    roleIds: Role['id'][] = []
  ): Promise<User | null> {
    if (typeof userId !== 'number' || isNaN(userId)) {
      throw new Error('Invalid userId')
    }

    const user = await User.findByPk(userId)
    if (!user) return null

    await user.update(updates, { userId: actionUserId })

    if (roleIds.length > 0) {
      const roles = await Role.findAll({ where: { id: roleIds } })
      await user.$set(User.RELATIONS.ROLES, roles, { userId: actionUserId })
    }

    return user
  }

  // Delete a user
  static async deleteUser(
    userId: User['id'],
    actionUserId: User['id']
  ): Promise<boolean> {
    if (typeof userId !== 'number' || isNaN(userId)) {
      throw new Error('Invalid userId')
    }

    const user = await User.findByPk(userId)
    if (!user) return false

    await user.destroy({ userId: actionUserId })
    return true
  }
}
