import { Department, Category, Item } from '@/models'
import { UnitType } from '@/models/Item'

describe('Item model validations', () => {
  let departmentId: number

  beforeEach(async () => {
    const dept = await Department.create({ name: 'Stationery' })
    departmentId = dept.id
  })

  it('should default quantity to 1 if not provided', async () => {
    const item = await Item.create({ name: 'Pen', departmentId })
    expect(item.quantity).toBe(1)
  })

  it('should fail if quantity is less than 1', async () => {
    expect.assertions(1)
    try {
      await Item.create({ name: 'Eraser', departmentId, quantity: 0 })
    } catch (error: any) {
      expect(error.name).toBe('SequelizeValidationError')
    }
  })

  it('should default unit to "und."', async () => {
    const item = await Item.create({ name: 'Notebook', departmentId })
    expect(item.unit).toBe(UnitType.UND)
  })

  it('should accept valid enum unit values', async () => {
    const item = await Item.create({
      name: 'Paper',
      departmentId,
      unit: UnitType.KG,
    })
    expect(item.unit).toBe(UnitType.KG)
  })

  it('should fail if unit is not a valid enum', async () => {
    expect.assertions(1)
    try {
      await Item.create({
        name: 'Folder',
        departmentId,
        unit: 'invalid-unit',
      })
    } catch (error: any) {
      expect(error.name).toMatch(/Sequelize.*Error/)
    }
  })
})

describe('Item associations', () => {
  it('should relate item to category and department', async () => {
    const dept = await Department.create({ name: 'Office Supplies' })

    const cat = await Category.create({
      name: 'Writing',
    })

    const item = await Item.create({
      name: 'Ballpoint Pen',
      categoryId: cat.id,
      departmentId: dept.id,
    })

    const fetchedItem = await Item.findByPk(item.id, {
      include: [Category, Department],
    })

    expect(fetchedItem?.category?.name).toBe('Writing')
    expect(fetchedItem?.department?.name).toBe('Office Supplies')
  })
})
