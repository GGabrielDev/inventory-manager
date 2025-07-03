import { Permission, Role, User } from '@/models' // Adjust the import paths as necessary

const entities = [
  'Category',
  'ChangeLog',
  'ChangeLogDetail',
  'Department',
  'Item',
  'Permission',
  'Role',
  'User',
]

const actions = ['create', 'get', 'edit', 'delete']

const permissions = entities.flatMap((entity) =>
  actions.map((action) => ({
    name: `${action}_${entity.toLowerCase()}`,
    description: `Allows a user to ${action} a ${entity}`,
  }))
)

export type PermissionType =
  `${(typeof actions)[number]}_${Lowercase<(typeof entities)[number]>}`

async function populateAdminAndPermissions() {
  try {
    // Create permissions
    await Permission.bulkCreate(permissions, {
      ignoreDuplicates: true,
      userId: 0,
    })

    // Create admin role
    const [adminRole, roleCreated] = await Role.findOrCreate({
      where: { name: 'admin' },
      defaults: { description: 'Administrator role with full permissions' },
      userId: 0,
    })

    if (roleCreated) {
      console.log('Admin role created')
    } else {
      console.log('Admin role already exists')
    }

    // Create admin user with ID 0
    const [_adminUser, userCreated] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        passwordHash: 'admin',
        roleId: adminRole.id,
      },
      userId: 0,
    })

    if (userCreated) {
      console.log('Admin user created')
    } else {
      console.log('Admin user already exists')
    }
  } catch (error) {
    console.error('Error populating admin and permissions:', error)
  }
}

export default populateAdminAndPermissions
