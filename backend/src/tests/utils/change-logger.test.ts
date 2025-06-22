import { logChange } from '@/utils/change-logger'

jest.mock('@/models', () => ({
  ChangeLog: { create: jest.fn().mockResolvedValue({ id: 123 }) },
  ChangeLogDetail: { create: jest.fn().mockResolvedValue({}) },
}))

import { Model } from 'sequelize'

import { ChangeLog, ChangeLogDetail } from '@/models'

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
      modelName: 'user' as any,
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
      modelName: 'user' as any,
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
      modelName: 'user' as any,
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
