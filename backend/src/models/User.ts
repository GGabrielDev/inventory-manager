import bcrypt from 'bcrypt'
import {
  AfterCreate,
  AfterDestroy,
  AfterUpdate,
  AllowNull,
  AutoIncrement,
  BeforeCreate,
  BeforeUpdate,
  BelongsToMany,
  Column,
  CreatedAt,
  DefaultScope,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript'

import { UserActionOptions } from '@/types/UserActionOptions'
import { logEntityAction } from '@/utils/entity-hooks'

import { ChangeLog, Role } from '.'
import { UserRole } from './join'

const RELATIONS = {
  CHANGELOGS: 'changeLogs',
  ROLES: 'roles',
} as const satisfies Record<string, keyof User>

@DefaultScope(() => ({
  attributes: { exclude: ['passwordHash'] },
}))
@Table
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number

  @AllowNull(false)
  @Unique
  @Column
  username!: string

  @AllowNull(false)
  @Column
  passwordHash!: string

  @BelongsToMany(() => Role, () => UserRole)
  roles!: Array<Role & { UserRole: UserRole }>

  @HasMany(() => ChangeLog)
  changeLogs!: ChangeLog[]

  @CreatedAt
  creationDate!: Date

  @UpdatedAt
  updatedOn!: Date

  @DeletedAt
  deletionDate?: Date

  static readonly RELATIONS = RELATIONS
  static SALT_ROUNDS = 10

  // Password Hashing
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('passwordHash')) {
      instance.passwordHash = await bcrypt.hash(
        instance.passwordHash,
        User.SALT_ROUNDS
      )
    }
  }

  // Password Verification
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash)
  }

  @AfterCreate
  static async logCreate(instance: User, options: UserActionOptions) {
    if (!(instance.id === 0))
      await logEntityAction(
        'create',
        instance,
        options,
        ChangeLog.RELATIONS.USER
      )
  }

  @AfterUpdate
  static async logUpdate(instance: User, options: UserActionOptions) {
    await logEntityAction('update', instance, options, ChangeLog.RELATIONS.USER)
  }

  @AfterDestroy
  static async logDestroy(instance: User, options: UserActionOptions) {
    await logEntityAction('delete', instance, options, ChangeLog.RELATIONS.USER)
  }
}
