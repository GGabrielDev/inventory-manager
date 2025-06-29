import {
  AfterCreate,
  AfterDestroy,
  AfterUpdate,
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  Validate,
} from 'sequelize-typescript'

import { UserActionOptions } from '@/types/UserActionOptions'
import { logHook } from '@/utils/change-logger'

import { Category, ChangeLog, Department } from '.'

const RELATIONS = {
  CATEGORY: 'category',
  CHANGELOGS: 'changeLogs',
  DEPARTMENT: 'department',
} as const satisfies Record<string, keyof Item>

export enum UnitType {
  UND = 'und.',
  KG = 'kg',
  L = 'l',
  M = 'm',
}

@Table
export default class Item extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @AllowNull(false)
  @Column
  name!: string

  @AllowNull(false)
  @Default(1)
  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 1,
    },
  })
  quantity!: number

  @AllowNull(false)
  @Default(UnitType.UND)
  @Validate({
    isInEnum(value: string) {
      if (!Object.values(UnitType).includes(value as UnitType)) {
        throw new Error(`Invalid unit: ${value}`)
      }
    },
  })
  @Column(DataType.ENUM(UnitType.UND))
  unit!: UnitType

  @CreatedAt
  creationDate!: Date

  @UpdatedAt
  updatedOn!: Date

  @DeletedAt
  deletionDate?: Date

  @ForeignKey(() => Category)
  @AllowNull(true)
  @Column
  categoryId?: number

  @ForeignKey(() => Department)
  @AllowNull(false)
  @Column
  departmentId!: number

  @BelongsTo(() => Category, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  category?: Category

  @BelongsTo(() => Department, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  department?: Department

  @HasMany(() => ChangeLog)
  changeLogs!: ChangeLog[]

  static readonly RELATIONS = RELATIONS

  @AfterCreate
  static async logCreate(instance: Item, options: UserActionOptions) {
    if (typeof options.userId !== 'number' || options.userId == null)
      throw new Error('userId required for changelog')
    await logHook('create', instance, {
      userId: options.userId,
      modelName: ChangeLog.RELATIONS.ITEM,
      modelId: instance.id,
      transaction: options.transaction,
    })
  }

  @AfterUpdate
  static async logUpdate(instance: Item, options: UserActionOptions) {
    if (typeof options.userId !== 'number' || options.userId == null)
      throw new Error('userId required for changelog')
    await logHook('update', instance, {
      userId: options.userId,
      modelName: ChangeLog.RELATIONS.ITEM,
      modelId: instance.id,
      transaction: options.transaction,
    })
  }

  @AfterDestroy
  static async logDestroy(instance: Item, options: UserActionOptions) {
    if (typeof options.userId !== 'number' || options.userId == null)
      throw new Error('userId required for changelog')
    await logHook('delete', instance, {
      userId: options.userId,
      modelName: ChangeLog.RELATIONS.ITEM,
      modelId: instance.id,
      transaction: options.transaction,
    })
  }
}
