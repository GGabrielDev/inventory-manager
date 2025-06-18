import { Department, Item } from '@/models'
import { describe, it, expect } from '@jest/globals'

describe('Department model', () => {
  it('should create a department with valid name', async () => {
    const department = await Department.create({ name: 'HR' })
    expect(department).toBeDefined()
    expect(department.name).toBe('HR')
  })

  it('should fail if name is missing', async () => {
    expect.assertions(1)
    try {
      await Department.create({})
    } catch (err: any) {
      expect(err.name).toMatch(/Sequelize.*Error/)
    }
  })

  it('should not allow duplicate department names', async () => {
    expect.assertions(1)
    await Department.create({ name: 'Finance' })
    try {
      await Department.create({ name: 'Finance' })
    } catch (err: any) {
      expect(err.name).toMatch(/Sequelize.*Error/)
    }
  })
})

describe('Department associations', () => {
  it('should fail if department is not provided during creation', async () => {
    expect.assertions(1)
    try {
      await Item.create({ name: 'Unassigned Item' })
    } catch (error: any) {
      expect(error.name).toMatch(/Sequelize.*Error/)
    }
  })

  it('should allow reassociating to a different department', async () => {
    const dept1 = await Department.create({ name: 'Warehouse' })
    const dept2 = await Department.create({ name: 'Admin' })

    let item = await Item.create({
      name: 'Laptop',
      quantity: 2,
      departmentId: dept1.id,
    })
    let fetched = await Item.findByPk(item.id, { include: Department })
    expect(fetched?.department?.name).toBe('Warehouse')

    await item.$set(Item.RELATIONS.DEPARTMENT, dept2)
    fetched = await Item.findByPk(item.id, { include: Department })
    expect(fetched?.department?.name).toBe('Admin')
  })
})
