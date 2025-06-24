import { Model } from 'sequelize'

import { ChangeLog, ChangeLogDetail } from '@/models'
import { inferOperation, logChange, logHook } from '@/utils/change-logger'

jest.mock('@/models', () => ({
  ChangeLog: { create: jest.fn().mockResolvedValue({ id: 123 }) },
  ChangeLogDetail: { create: jest.fn().mockResolvedValue({}) },
}))

describe('logChange', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  function mockInstance(
    data: Record<string, any>,
    prev: Record<string, any>
  ): Model {
    return {
      dataValues: data,
      previous: (key: string) => prev[key],
      get: (key: string) => data[key],
    } as unknown as Model
  }

  it('logs updated fields', async () => {
    const instance = mockInstance(
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 30 }
    )
    await logChange({
      instance,
      operation: 'update',
      userId: 1,
      modelName: 'user',
      modelId: 42,
    })

    expect(ChangeLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'update',
        changedBy: 1,
        modelName: 'user',
        modelId: 42,
      }),
      expect.any(Object)
    )
    expect(ChangeLogDetail.create).toHaveBeenCalledWith(
      expect.objectContaining({
        field: 'name',
        oldValue: 'Bob',
        newValue: 'Alice',
        diffType: 'update',
      }),
      expect.any(Object)
    )
    expect(ChangeLogDetail.create).toHaveBeenCalledTimes(1)
  })

  it('logs all fields on create', async () => {
    const instance = mockInstance({ name: 'Alice', age: 30 }, {})
    await logChange({
      instance,
      operation: 'create',
      userId: 1,
      modelName: 'user',
      modelId: 42,
    })

    expect(ChangeLogDetail.create).toHaveBeenCalledWith(
      expect.objectContaining({
        field: 'name',
        oldValue: null,
        newValue: 'Alice',
        diffType: 'create',
      }),
      expect.any(Object)
    )
    expect(ChangeLogDetail.create).toHaveBeenCalledWith(
      expect.objectContaining({
        field: 'age',
        oldValue: null,
        newValue: 30,
        diffType: 'create',
      }),
      expect.any(Object)
    )
    expect(ChangeLogDetail.create).toHaveBeenCalledTimes(2)
  })

  it('logs all fields on delete', async () => {
    const instance = mockInstance({ name: 'Alice', age: 30 }, {})
    await logChange({
      instance,
      operation: 'delete',
      userId: 1,
      modelName: 'user',
      modelId: 42,
    })

    expect(ChangeLogDetail.create).toHaveBeenCalledWith(
      expect.objectContaining({
        field: 'name',
        oldValue: 'Alice',
        newValue: null,
        diffType: 'delete',
      }),
      expect.any(Object)
    )
    expect(ChangeLogDetail.create).toHaveBeenCalledWith(
      expect.objectContaining({
        field: 'age',
        oldValue: 30,
        newValue: null,
        diffType: 'delete',
      }),
      expect.any(Object)
    )
    expect(ChangeLogDetail.create).toHaveBeenCalledTimes(2)
  })
})

describe('logHook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  function mockHookInstance(
    data: Record<string, any>,
    prev: Record<string, any>,
    changedFields: string[],
    getDataValueMap: Record<string, any> = {},
    modelName = 'User'
  ): Model {
    return {
      dataValues: data,
      previous: (key: string) => prev[key],
      get: (key: string) => data[key],
      changed: () => changedFields,
      getDataValue: (key: string) => getDataValueMap[key],
      constructor: { name: modelName },
    } as unknown as Model
  }

  it('calls logChange with correct params on update', async () => {
    const instance = mockHookInstance(
      { name: 'Alice', age: 30, id: 99 },
      { name: 'Bob', age: 30, id: 99 },
      ['name'],
      {},
      'User'
    )
    await logHook('update', instance, { userId: 77, transaction: undefined })

    expect(ChangeLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'update',
        changedBy: 77,
        modelName: 'User',
        modelId: 99,
      }),
      expect.any(Object)
    )
  })

  it('infers link operation', async () => {
    const instance = mockHookInstance(
      { memberId: 10, id: 5 },
      { memberId: null, id: 5 },
      ['memberId'],
      { memberId: 10 },
      'Group'
    )
    await logHook('update', instance, { userId: 2, transaction: null })

    expect(ChangeLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'link',
        changedBy: 2,
        modelName: 'Group',
        modelId: 5,
        relation: 'memberId',
        relatedId: 10,
      }),
      expect.any(Object)
    )
    expect(ChangeLogDetail.create).toHaveBeenCalledWith(
      expect.objectContaining({
        field: 'memberId',
        oldValue: null,
        newValue: 10,
        diffType: 'link',
      }),
      expect.any(Object)
    )
  })

  it('infers unlink operation', async () => {
    const instance = mockHookInstance(
      { memberId: null, id: 5 },
      { memberId: 10, id: 5 },
      ['memberId'],
      { memberId: null },
      'Group'
    )
    await logHook('update', instance, { userId: 3, transaction: null })

    expect(ChangeLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: 'unlink',
        changedBy: 3,
        modelName: 'Group',
        modelId: 5,
        relation: 'memberId',
        relatedId: null,
      }),
      expect.any(Object)
    )
    expect(ChangeLogDetail.create).toHaveBeenCalledWith(
      expect.objectContaining({
        field: 'memberId',
        oldValue: 10,
        newValue: null,
        diffType: 'unlink',
      }),
      expect.any(Object)
    )
  })

  it('throws if userId is missing', async () => {
    const instance = mockHookInstance(
      { name: 'Alice', id: 1 },
      { name: 'Alice', id: 1 },
      [],
      {},
      'User'
    )
    await expect(logHook('update', instance, {})).rejects.toThrow(
      'userId missing'
    )
  })
})

describe('inferOperation', () => {
  it('returns original operation if not update', () => {
    expect(inferOperation({}, 'create')).toBe('create')
    expect(inferOperation({}, 'delete')).toBe('delete')
  })

  it('returns update if no *Id fields changed', () => {
    const instance = { changed: () => ['foo'] }
    expect(inferOperation(instance, 'update')).toBe('update')
  })

  it('returns link if *Id changed to value', () => {
    const instance = {
      changed: () => ['barId'],
      getDataValue: (k: string) => (k === 'barId' ? 42 : undefined),
    }
    expect(inferOperation(instance, 'update')).toBe('link')
  })

  it('returns unlink if *Id changed to null', () => {
    const instance = {
      changed: () => ['barId'],
      getDataValue: (k: string) => (k === 'barId' ? null : undefined),
    }
    expect(inferOperation(instance, 'update')).toBe('unlink')
  })
})
