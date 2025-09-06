import {
  AfterBulkCreate,
  AfterBulkDestroy,
  AfterBulkUpdate,
  AfterCreate,
  AfterDestroy,
  AfterUpdate,
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  HasMany,
  // HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript'

import { UserActionOptions } from '@/types/UserActionOptions'
import { logEntityAction } from '@/utils/entity-hooks'

import { ChangeLog, State } from '.'
// import { Parish } from '.'

const RELATIONS = {
  CHANGELOGS: 'changeLogs',
  STATE: 'state',
} as const satisfies Record<string, keyof Municipality>

@Table
export default class Municipality extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number

  @AllowNull(false)
  @Column
  name!: string

  @ForeignKey(() => State)
  @Column(DataType.INTEGER)
  stateId!: number

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @DeletedAt
  deletionDate?: Date

  @BelongsTo(() => State)
  state!: State

  // @HasMany(() => Parish)
  // parishes!: Parish[]

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
      ChangeLog.RELATIONS.MUNICIPALITY
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
      ChangeLog.RELATIONS.MUNICIPALITY
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
      ChangeLog.RELATIONS.MUNICIPALITY
    )
  }
}
