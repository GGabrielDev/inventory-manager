import {
  AfterCreate,
  AfterDestroy,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { Role, User } from '@/models'
import { UserActionOptions } from '@/types/UserActionOptions'
import { logHook } from '@/utils/change-logger'

@Table({ tableName: 'UserRoles', timestamps: false })
export default class UserRole extends Model {
  @ForeignKey(() => User)
  @Column
  userId!: number

  @ForeignKey(() => Role)
  @Column
  roleId!: number

  // Add hooks for link/unlink
  @AfterCreate
  static async logLink(instance: UserRole, options: UserActionOptions) {
    if (typeof options.userId !== 'number' || options.userId == null)
      throw new Error('userId required for changelog')
    await logHook('link', instance, {
      userId: options.userId,
      modelName: 'UserRole',
      modelId: instance.userId,
      relation: 'roleId',
      relatedId: instance.roleId,
      transaction: options.transaction,
    })
  }

  @AfterDestroy
  static async logUnlink(instance: UserRole, options: UserActionOptions) {
    if (typeof options.userId !== 'number' || options.userId == null)
      throw new Error('userId required for changelog')
    await logHook('unlink', instance, {
      userId: options.userId,
      modelName: 'UserRole',
      modelId: instance.userId,
      relation: 'roleId',
      relatedId: instance.roleId,
      transaction: options.transaction,
    })
  }
}
