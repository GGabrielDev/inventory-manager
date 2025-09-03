import {
  AfterBulkCreate,
  AfterBulkDestroy,
  AfterBulkUpdate,
  AfterCreate,
  AfterDestroy,
  AfterUpdate,
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
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

import { ChangeLog } from '.'

// import { Municipality } from '.'

const RELATIONS = {
  CHANGELOGS: 'changeLogs',
} as const satisfies Record<string, keyof State>

@Table
export default class State extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number

  @AllowNull(false)
  @Unique
  @Column
  name!: string

  @CreatedAt
  creationDate!: Date

  @UpdatedAt
  updatedOn!: Date

  @DeletedAt
  deletionDate?: Date

  // @HasMany(() => Municipality)
  // Municipalities: Municipality[]

  @HasMany(() => ChangeLog)
  changeLogs!: ChangeLog[]

  static readonly RELATIONS = RELATIONS

  @AfterCreate
  @AfterBulkCreate
  static async logCreate(
    instance: State | State[],
    options: UserActionOptions
  ) {
    await logEntityAction(
      'create',
      instance,
      options,
      ChangeLog.RELATIONS.STATE
    )
  }

  @AfterUpdate
  @AfterBulkUpdate
  static async logUpdate(
    instance: State | State[],
    options: UserActionOptions
  ) {
    await logEntityAction(
      'update',
      instance,
      options,
      ChangeLog.RELATIONS.STATE
    )
  }

  @AfterDestroy
  @AfterBulkDestroy
  static async logDestroy(
    instance: State | State[],
    options: UserActionOptions
  ) {
    await logEntityAction(
      'delete',
      instance,
      options,
      ChangeLog.RELATIONS.STATE
    )
  }
}
