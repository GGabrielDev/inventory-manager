import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  Validate,
} from 'sequelize-typescript'

import { Category, Department } from '.'

const RELATIONS = {
  CATEGORY: 'category',
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
  creationDate: Date

  @UpdatedAt
  updatedOn: Date

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

  static readonly RELATIONS = RELATIONS
}
