import {
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
}
