import { ChangeLog, ChangeLogDetail, Department, Item, User } from '@/models'
import { DIFF_TYPES } from '@/models/ChangeLog'

describe('ChangeLogDetail Model', () => {
  let user: User
  let changeLog: ChangeLog
  let department: Department
  let item: Item

  beforeEach(async () => {
    user = await User.create(
      { id: 0, username: 'TestUser', passwordHash: 'test' },
      { userId: 0 }
    )
    department = await Department.create(
      { name: 'Test Department' },
      { userId: user.id }
    )
    item = await Item.create(
      { name: 'Test Item', departmentId: department.id },
      { userId: user.id }
    )
    changeLog = await ChangeLog.create({
      operation: 'update',
      changedBy: user.id,
      itemId: item.id,
    })
  })

  test('creates with valid diffType', async () => {
    for (const diffType of DIFF_TYPES) {
      const detail = await ChangeLogDetail.create({
        changeLogId: changeLog.id,
        field: 'name',
        oldValue: 'A',
        newValue: 'B',
        diffType,
      })
      expect(detail.diffType).toBe(diffType)
    }
  })

  test('rejects invalid diffType', async () => {
    await expect(
      ChangeLogDetail.create({
        changeLogId: changeLog.id,
        field: 'name',
        diffType: 'invalid',
      })
    ).rejects.toThrow()
  })

  test('requires changeLogId and field', async () => {
    await expect(
      ChangeLogDetail.create({
        diffType: DIFF_TYPES[0],
      })
    ).rejects.toThrow()
  })

  test('associates to ChangeLog', async () => {
    const detail = await ChangeLogDetail.create({
      changeLogId: changeLog.id,
      field: 'status',
      diffType: DIFF_TYPES[0],
    })
    const parent = await detail.$get(ChangeLogDetail.RELATIONS.CHANGELOG)
    expect(parent?.id).toBe(changeLog.id)
  })
})
