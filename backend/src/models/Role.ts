import {
  AfterCreate,
  AfterDestroy,
  AfterUpdate,
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript'

import { UserActionOptions } from '@/types/UserActionOptions'
import { logHook } from '@/utils/change-logger'

import { User } from '.'
import { UserRole } from './join'

const RELATIONS = {
  USERS: 'users',
} as const satisfies Record<string, keyof Role>

@Table
export default class Role extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @AllowNull(false)
  @Unique
  @Column
  name!: string

  @BelongsToMany(() => User, () => UserRole)
  users!: Array<User & { UserRole: UserRole }>

  @CreatedAt
  creationDate!: Date

  @UpdatedAt
  updatedOn!: Date

  @DeletedAt
  deletionDate?: Date

  static readonly RELATIONS = RELATIONS

  @AfterCreate
  static async logCreate(instance: Role, options: UserActionOptions) {
    if (typeof options.userId !== 'number' || options.userId == null)
      throw new Error('userId required for changelog')
    await logHook('create', instance, {
      userId: options.userId,
      modelName: 'Role',
      modelId: instance.id,
      transaction: options.transaction,
    })
  }

  @AfterUpdate
  static async logUpdate(instance: Role, options: UserActionOptions) {
    if (typeof options.userId !== 'number' || options.userId == null)
      throw new Error('userId required for changelog')
    await logHook('update', instance, {
      userId: options.userId,
      modelName: 'Role',
      modelId: instance.id,
      transaction: options.transaction,
    })
  }

  @AfterDestroy
  static async logDestroy(instance: Role, options: UserActionOptions) {
    if (typeof options.userId !== 'number' || options.userId == null)
      throw new Error('userId required for changelog')
    await logHook('delete', instance, {
      userId: options.userId,
      modelName: 'Role',
      modelId: instance.id,
      transaction: options.transaction,
    })
  }
}
