import {
  AllowNull,
  AutoIncrement,
  BeforeValidate,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'

import { Category, ChangeLogDetail, Department, Item, User } from '.'

const RELATIONS = {
  CHANGELOG_DETAILS: 'changeLogDetails',
  CATEGORY: 'category',
  DEPARTMENT: 'department',
  ITEM: 'item',
  USER: 'user',
} as const satisfies Record<string, keyof ChangeLog>

export const OPERATION_TYPES = [
  'create',
  'update',
  'delete',
  'archive',
  'link',
] as const
export type OperationType = (typeof OPERATION_TYPES)[number]

@Table
export default class ChangeLog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...OPERATION_TYPES),
    validate: { isIn: [OPERATION_TYPES as unknown as string[]] },
  })
  operation!: OperationType

  @Column(process.env.NODE_ENV === 'test' ? DataType.JSON : DataType.JSONB)
  changeDetails?: object

  @CreatedAt
  changedAt!: Date

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  changedBy!: number

  @BelongsTo(() => User)
  user!: User

  @ForeignKey(() => Item)
  @Column(DataType.INTEGER)
  itemId?: number

  @BelongsTo(() => Item)
  item?: Item

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  categoryId?: number

  @BelongsTo(() => Category)
  category?: Category

  @ForeignKey(() => Department)
  @Column(DataType.INTEGER)
  departmentId?: number

  @BelongsTo(() => Department)
  department?: Department

  @HasMany(() => ChangeLogDetail)
  changeLogDetails!: ChangeLogDetail[]

  @BeforeValidate
  static enforceAtLeastOneAssociation(instance: ChangeLog) {
    const { itemId, categoryId, departmentId } = instance
    if (!itemId && !categoryId && !departmentId) {
      throw new Error('ChangeLog: At least one association must be set.')
    }
  }

  static readonly RELATIONS = RELATIONS
}
