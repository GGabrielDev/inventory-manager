import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript'

import { Item } from '.'

const RELATIONS = {
  ITEMS: 'items',
} as const satisfies Record<string, keyof Department>

@Table
export default class Department extends Model {
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

  @HasMany(() => Item)
  items!: Item[]

  static readonly RELATIONS = RELATIONS
}
