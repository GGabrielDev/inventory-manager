import { Column, ForeignKey, Model, Table } from 'sequelize-typescript'

import { Role, User } from '../.'

@Table({ tableName: 'UserRoles', timestamps: false })
export default class UserRole extends Model {
  @ForeignKey(() => User)
  @Column
  userId!: number

  @ForeignKey(() => Role)
  @Column
  roleId!: number
}
