import {
  AfterCreate,
  AfterDestroy,
  AfterUpdate,
  AllowNull,
  AutoIncrement,
  BeforeDestroy,
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
import { logHook } from '@/utils/change-logger'

import { ChangeLog, Item } from '.'

const RELATIONS = {
  CHANGELOGS: 'changeLogs',
  ITEMS: 'items',
} as const satisfies Record<string, keyof Category>

@Table({ paranoid: true })
export default class Category extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @AllowNull(false)
  @Unique
  @Column
  name!: string

  @CreatedAt
  creationDate: Date

  @UpdatedAt
  updatedOn: Date

  @DeletedAt
  deletionDate?: Date

  @HasMany(() => Item)
  items!: Item[]

  @HasMany(() => ChangeLog)
  changeLogs!: ChangeLog[]

  static readonly RELATIONS = RELATIONS

  @AfterCreate
  static async logCreate(instance: Category, options: UserActionOptions) {
    if (typeof options.userId !== 'number' || options.userId == null)
      throw new Error('userId required for changelog')
    await logHook('create', instance, {
      userId: options.userId,
      modelName: ChangeLog.RELATIONS.CATEGORY,
      modelId: instance.id,
      transaction: options.transaction,
    })
  }

  @AfterUpdate
  static async logUpdate(instance: Category, options: UserActionOptions) {
    if (typeof options.userId !== 'number' || options.userId == null)
      throw new Error('userId required for changelog')
    await logHook('update', instance, {
      userId: options.userId,
      modelName: ChangeLog.RELATIONS.CATEGORY,
      modelId: instance.id,
      transaction: options.transaction,
    })
  }

  @BeforeDestroy
  static async checkItemsBeforeDestroy(instance: Category) {
    const itemCount = await instance.$count('items')
    if (itemCount > 0) {
      throw new Error('Cannot delete category with assigned items.')
    }
  }

  @AfterDestroy
  static async logDestroy(instance: Category, options: UserActionOptions) {
    if (typeof options.userId !== 'number' || options.userId == null)
      throw new Error('userId required for changelog')
    await logHook('delete', instance, {
      userId: options.userId,
      modelName: ChangeLog.RELATIONS.CATEGORY,
      modelId: instance.id,
      transaction: options.transaction,
    })
  }
}
