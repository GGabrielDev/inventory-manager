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
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { UserActionOptions } from '@/types/UserActionOptions'
import { logEntityAction } from '@/utils/entity-hooks'

import { ChangeLog, Municipality } from '.'

const RELATIONS = {
  CHANGELOGS: 'changeLogs',
  MUNICIPALITY: 'municipality',
} as const satisfies Record<string, keyof Parish>

@Table
export default class Parish extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number

  @AllowNull(false)
  @Column
  name!: string

  @ForeignKey(() => Municipality)
  @Column(DataType.INTEGER)
  municipalityId!: number

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date

  @DeletedAt
  deletionDate?: Date

  @BelongsTo(() => Municipality)
  municipality!: Municipality

  @HasMany(() => ChangeLog)
  changeLogs!: ChangeLog[]

  static readonly RELATIONS = RELATIONS

  @AfterCreate
  @AfterBulkCreate
  static async logCreate(
    instance: Parish | Parish[],
    options: UserActionOptions
  ) {
    await logEntityAction(
      'create',
      instance,
      options,
      ChangeLog.RELATIONS.PARISH
    )
  }

  @AfterUpdate
  @AfterBulkUpdate
  static async logUpdate(
    instance: Parish | Parish[],
    options: UserActionOptions
  ) {
    await logEntityAction(
      'update',
      instance,
      options,
      ChangeLog.RELATIONS.PARISH
    )
  }

  @AfterDestroy
  @AfterBulkDestroy
  static async logDestroy(
    instance: Parish | Parish[],
    options: UserActionOptions
  ) {
    await logEntityAction(
      'delete',
      instance,
      options,
      ChangeLog.RELATIONS.PARISH
    )
  }
}
