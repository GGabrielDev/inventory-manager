import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  AllowNull,
  Default,
  DataType,
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
  @Column({
    type: DataType.ENUM(...Object.values(UnitType)),
  })
  unit!: UnitType

  @ForeignKey(() => Category)
  @AllowNull(true)
  @Column
  categoryId?: number

  @BelongsTo(() => Category)
  category?: Category

  @ForeignKey(() => Department)
  @AllowNull(false)
  @Column
  departmentId!: number

  @BelongsTo(() => Department)
  department?: Department

  static readonly RELATIONS = RELATIONS
}
