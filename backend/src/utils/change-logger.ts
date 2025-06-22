import { Model, Transaction } from 'sequelize'

import { ChangeLog, ChangeLogDetail } from '@/models'
import { OperationType } from '@/models/ChangeLog'

type RELATIONS = keyof typeof ChangeLog.RELATIONS

type LogChangeProps = {
  instance: Model
  operation: OperationType
  userId: number
  modelName: RELATIONS
  modelId: number | string
  relation?: string // for link/unlink actions
  relatedId?: number | string // optional for association actions
  transaction?: Transaction
}

export async function logChange({
  instance,
  operation,
  userId,
  modelName,
  modelId,
  relation,
  relatedId,
  transaction,
}: LogChangeProps) {
  const changedAt = new Date()
  const details: any[] = []

  if (operation === 'update') {
    for (const key of Object.keys(instance.dataValues)) {
      const prev = instance.previous(key)
      const curr = instance.get(key)
      if (prev !== curr) {
        details.push({
          field: key,
          oldValue: prev,
          newValue: curr,
          diffType: 'update',
        })
      }
    }
    if (details.length === 0) return
  } else if (operation === 'create' || operation === 'delete') {
    for (const key of Object.keys(instance.dataValues)) {
      details.push({
        field: key,
        oldValue: operation === 'create' ? null : instance.get(key),
        newValue: operation === 'create' ? instance.get(key) : null,
        diffType: operation,
      })
    }
  } else if (operation === 'link' || operation === 'unlink') {
    details.push({
      field: relation,
      oldValue: operation === 'link' ? null : relatedId,
      newValue: operation === 'link' ? relatedId : null,
      diffType: operation,
    })
  }

  // Build dynamic object for ChangeLog associations
  const logData: any = {
    operation,
    changedBy: userId,
    changedAt,
    updatedAt: changedAt,
    modelName,
    modelId,
  }
  // Optionally, add relation info for link/unlink
  if (relation) logData.relation = relation
  if (relatedId) logData.relatedId = relatedId

  const changeLog = await ChangeLog.create(logData, { transaction })

  for (const detail of details) {
    await ChangeLogDetail.create(
      {
        changeLogId: changeLog.id,
        field: detail.field,
        oldValue: detail.oldValue,
        newValue: detail.newValue,
        diffType: detail.diffType,
        createdAt: changedAt,
        updatedAt: changedAt,
      },
      { transaction }
    )
  }
}
