import { ItemController } from '@/controllers'
import { Category, Department, Item, User } from '@/models'
import { UnitType } from '@/models/Item'

describe('ItemController', () => {
  let systemUser: User
  let department: Department
  let category: Category

  beforeEach(async () => {
    systemUser = await User.create(
      { id: 0, username: 'TestUser', passwordHash: 'pw' },
      { userId: 0 }
    )

    department = await Department.create(
      { name: 'Stationery' },
      { userId: systemUser.id }
    )

    category = await Category.create(
      { name: 'Writing' },
      { userId: systemUser.id }
    )
  })

  it('should create an item with valid fields', async () => {
    const item = await ItemController.createItem(
      'Pen',
      department.id,
      systemUser.id,
      10,
      UnitType.UND,
      category.id
    )
    expect(item.id).toBeDefined()
    expect(item.name).toBe('Pen')
    expect(item.quantity).toBe(10)
    expect(item.unit).toBe(UnitType.UND)
  })

  it('should get an item by ID', async () => {
    const createdItem = await ItemController.createItem(
      'Notebook',
      department.id,
      systemUser.id
    )
    const item = await ItemController.getItemById(createdItem.id)
    expect(item).toBeDefined()
    expect(item?.name).toBe('Notebook')
  })

  it('should get all items with pagination', async () => {
    await ItemController.createItem('Item1', department.id, systemUser.id)
    await ItemController.createItem('Item2', department.id, systemUser.id)

    const result = await ItemController.getAllItems({ page: 1, pageSize: 1 })
    expect(result.data.length).toBe(1)
    expect(result.total).toBeGreaterThanOrEqual(2)
    expect(result.totalPages).toBeGreaterThanOrEqual(2)
  })

  it('should update an item', async () => {
    const item = await ItemController.createItem(
      'Eraser',
      department.id,
      systemUser.id
    )
    const updatedItem = await ItemController.updateItem(
      item.id,
      { name: 'Rubber' },
      systemUser.id
    )
    expect(updatedItem).toBeDefined()
    expect(updatedItem?.name).toBe('Rubber')
  })

  it('should delete an item', async () => {
    const item = await ItemController.createItem(
      'Marker',
      department.id,
      systemUser.id
    )
    const result = await ItemController.deleteItem(item.id, systemUser.id)
    expect(result).toBe(true)

    const deletedItem = await Item.findByPk(item.id, { paranoid: false })
    expect(deletedItem).not.toBeNull()
    expect(deletedItem?.deletionDate).not.toBeNull()
  })

  it('should not find a non-existent item', async () => {
    const item = await ItemController.getItemById(9999)
    expect(item).toBeNull()
  })

  it('should handle unique item name constraint', async () => {
    await ItemController.createItem('UniqueItem', department.id, systemUser.id)
    await expect(
      ItemController.createItem('UniqueItem', department.id, systemUser.id)
    ).rejects.toThrow()
  })
})

describe('ItemController - Edge Cases and Invalid Inputs', () => {
  let systemUser: User
  let department: Department

  beforeEach(async () => {
    systemUser = await User.create(
      { id: 0, username: 'TestUser', passwordHash: 'pw' },
      { userId: 0 }
    )

    department = await Department.create(
      { name: 'Stationery' },
      { userId: systemUser.id }
    )
  })

  it('should throw an error if item name is missing when creating an item', async () => {
    await expect(
      ItemController.createItem('', department.id, systemUser.id)
    ).rejects.toThrow('Validation error')
  })

  it('should throw an error if departmentId is invalid when creating an item', async () => {
    await expect(
      ItemController.createItem('InvalidItem', -1, systemUser.id)
    ).rejects.toThrow('Invalid departmentId')
  })

  it('should throw an error if userId is invalid when creating an item', async () => {
    await expect(
      ItemController.createItem('InvalidItem', department.id, -1)
    ).rejects.toThrow('Invalid userId')
  })

  it('should throw an error if quantity is less than 1', async () => {
    await expect(
      ItemController.createItem(
        'InvalidQuantity',
        department.id,
        systemUser.id,
        0
      )
    ).rejects.toThrow('Validation error: Quantity must be at least 1')
  })

  it('should throw an error if unit is not a valid enum', async () => {
    await expect(
      ItemController.createItem(
        'InvalidUnit',
        department.id,
        systemUser.id,
        1,
        'invalid-unit' as UnitType
      )
    ).rejects.toThrow('Invalid unit: invalid-unit')
  })

  it('should return null if trying to update a non-existent item', async () => {
    const result = await ItemController.updateItem(
      9999,
      { name: 'newname' },
      systemUser.id
    )
    expect(result).toBeNull()
  })

  it('should return false if trying to delete a non-existent item', async () => {
    const result = await ItemController.deleteItem(9999, systemUser.id)
    expect(result).toBe(false)
  })

  it('should handle invalid page number in pagination', async () => {
    const result = await ItemController.getAllItems({ page: -1, pageSize: 1 })
    expect(result.data.length).toBe(0)
    expect(result.total).toBe(0)
  })

  it('should handle invalid page size in pagination', async () => {
    const result = await ItemController.getAllItems({ page: 1, pageSize: -1 })
    expect(result.data.length).toBe(0)
    expect(result.total).toBe(0)
  })

  it('should handle non-numeric itemId in getItemById', async () => {
    await expect(ItemController.getItemById(NaN)).rejects.toThrow(
      'Invalid itemId'
    )
  })
})
