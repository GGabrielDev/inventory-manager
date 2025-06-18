import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  AllowNull,
  Unique,
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

  @HasMany(() => Item)
  items!: Item[]

  static readonly RELATIONS = RELATIONS
}
