import { Model, Transaction } from 'sequelize'

import { ChangeLog, ChangeLogDetail } from '@/models'
import { operationToDiffType, OperationType } from '@/models/ChangeLog'

type RELATIONS = (typeof ChangeLog.RELATIONS)[keyof typeof ChangeLog.RELATIONS]

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

// Exporting for testing, not expected to be used standalone
export function inferOperation(instance: any, operation: OperationType) {
  if (operation === 'update') {
    const changedFields = instance.changed() as string[] // get changed fields
    if (changedFields.some((f) => f.endsWith('Id'))) {
      // You can further check if it's a new value (link) or set to null (unlink)
      return instance.getDataValue(
        changedFields.find((f) => f.endsWith('Id')!)!
      ) == null
        ? 'unlink'
        : 'link'
    }
  }
  return operation
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
          diffType: operationToDiffType('update'),
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
        diffType: operationToDiffType(operation),
      })
    }
  } else if (operation === 'link' || operation === 'unlink') {
    details.push({
      field: relation,
      oldValue:
        operation === 'link'
          ? null
          : relation
            ? instance.previous(relation)
            : null,
      newValue: operation === 'link' ? relatedId : null,
      diffType: operationToDiffType(operation),
    })
  }

  // Build dynamic object for ChangeLog associations
  const logData: any = {
    operation,
    changedBy: userId,
    changedAt,
    updatedAt: changedAt,
  }

  // Set the correct FK based on modelName and modelId
  const fkField =
    ChangeLog.RELATIONS_ID[
      String(modelName).toUpperCase() as keyof typeof ChangeLog.RELATIONS_ID
    ]
  if (fkField) logData[fkField] = modelId

  // Optionally, add relation info for link/unlink
  if (relation && relatedId) {
    logData.changeDetails = {
      ...(logData.changeDetails || {}),
      relation,
      relatedId,
    }
  }

  const changeLog = await ChangeLog.create(logData, { transaction })

  for (const detail of details) {
    try {
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
    } catch (err) {
      console.error('Error creating ChangeLogDetail:', err)
    }
  }
}

export async function logHook(
  operation: OperationType,
  instance: Model,
  options: any
) {
  // TODO: Remove debug to console
  console.log(
    '[logHook] instance type:',
    instance?.constructor?.name,
    'has .get:',
    typeof instance?.get === 'function'
  )

  const actualOperation = inferOperation(instance, operation)

  const userId = options.userId || (options as any).userId
  if (typeof userId !== 'number' || userId == null)
    throw new Error('userId missing in options for logHook')

  // TODO: Remove debug to console
  if (typeof instance.get !== 'function') {
    console.error('[logHook] instance does not have .get:', instance)
    throw new Error('logHook: instance is not a Sequelize Model')
  }

  const modelName = (instance.constructor as any).name
  const modelId = instance.get('id') as string | number

  let relation: string | undefined = undefined
  let relatedId: number | string | undefined = undefined

  if (actualOperation === 'link' || actualOperation === 'unlink') {
    const changedFields = instance.changed() as string[]
    const relField = changedFields.find((f) => f.endsWith('Id'))
    if (relField) {
      relation = relField
      relatedId = instance.get(relField) as string | number | undefined
    }
  }

  // For direct User changes, record as relation to userId
  if (!relation && modelName === 'User') {
    relation = 'userId'
    relatedId = modelId
  }

  await logChange({
    instance,
    operation: actualOperation as OperationType,
    userId,
    modelName,
    modelId,
    relation,
    relatedId,
    transaction: options.transaction,
  })
}
