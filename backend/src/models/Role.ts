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
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript'

import { UserActionOptions } from '@/types/UserActionOptions'
import { logEntityAction } from '@/utils/entity-hooks'

import { ChangeLog, User } from '.'
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

  @HasMany(() => ChangeLog)
  changeLogs!: ChangeLog[]

  static readonly RELATIONS = RELATIONS

  @AfterCreate
  static async logCreate(instance: Role, options: UserActionOptions) {
    await logEntityAction('create', instance, options, ChangeLog.RELATIONS.ROLE)
  }

  @AfterUpdate
  static async logUpdate(instance: Role, options: UserActionOptions) {
    await logEntityAction('update', instance, options, ChangeLog.RELATIONS.ROLE)
  }

  @AfterDestroy
  static async logDestroy(instance: Role, options: UserActionOptions) {
    await logEntityAction('delete', instance, options, ChangeLog.RELATIONS.ROLE)
  }
}
