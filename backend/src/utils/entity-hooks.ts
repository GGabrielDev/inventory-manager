import { Model } from 'sequelize-typescript'

import { UserActionOptions } from '@/types/UserActionOptions'
import { logHook } from '@/utils/change-logger'

export async function logEntityAction(
  action: 'create' | 'update' | 'delete',
  instance: Model,
  options: UserActionOptions,
  modelName: string
) {
  if (typeof options.userId !== 'number' || options.userId == null) {
    throw new Error('userId required for changelog')
  }

  await logHook(action, instance, {
    userId: options.userId,
    modelName,
    modelId: instance.id,
    transaction: options.transaction,
  })
}
