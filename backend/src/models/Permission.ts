import {
  AfterCreate,
  AfterDestroy,
  AfterUpdate,
  AutoIncrement,
  Column,
  DataType,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'

import { UserActionOptions } from '@/types/UserActionOptions'
import { logEntityAction } from '@/utils/entity-hooks'

import { ChangeLog } from '.'

const RELATIONS = {
  CHANGELOGS: 'changeLogs',
} as const satisfies Record<string, keyof Permission>

@Table
export default class Permission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  })
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  description!: string

  @DeletedAt
  deletionDate?: Date

  @HasMany(() => ChangeLog)
  changeLogs!: ChangeLog[]

  static readonly RELATIONS = RELATIONS

  @AfterCreate
  static async logCreate(instance: Permission, options: UserActionOptions) {
    await logEntityAction(
      'create',
      instance,
      options,
      ChangeLog.RELATIONS.PERMISSION
    )
  }

  @AfterUpdate
  static async logUpdate(instance: Permission, options: UserActionOptions) {
    await logEntityAction(
      'update',
      instance,
      options,
      ChangeLog.RELATIONS.PERMISSION
    )
  }

  @AfterDestroy
  static async logDestroy(instance: Permission, options: UserActionOptions) {
    await logEntityAction(
      'delete',
      instance,
      options,
      ChangeLog.RELATIONS.PERMISSION
    )
  }
}
