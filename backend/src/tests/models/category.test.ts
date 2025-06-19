import { beforeEach, describe, expect, it } from '@jest/globals'

import { Category, Department, Item } from '@/models'

describe('Category model', () => {
  let departmentId: number

  beforeEach(async () => {
    const dept = await Department.create({ name: 'Tech' })
    departmentId = dept.id
  })

  it('should create category with valid name', async () => {
    const category = await Category.create({ name: 'Hardware', departmentId })
    expect(category).toBeDefined()
    expect(category.name).toBe('Hardware')
  })

  it('should fail if name is missing', async () => {
    expect.assertions(1)
    try {
      await Category.create({ departmentId })
    } catch (err: any) {
      expect(err.name).toMatch(/Sequelize.*Error/)
    }
  })

  it('should not allow duplicate category names', async () => {
    expect.assertions(1)
    await Category.create({ name: 'Tools' })
    try {
      await Category.create({ name: 'Tools' })
    } catch (err: any) {
      expect(err.name).toMatch(/Sequelize.*Error/)
    }
  })
})

describe('Category associations', () => {
  let item: Item

  beforeEach(async () => {
    const dept = await Department.create({ name: 'Tech' })
    item = await Item.create({
      name: 'Laptop',
      quantity: 2,
      departmentId: dept.id,
    })
  })

  it('should allow associating a category after item creation', async () => {
    const category = await Category.create({ name: 'Electronics' })
    await item.$set(Item.RELATIONS.CATEGORY, category)

    const fetched = await Item.findByPk(item.id, { include: Category })
    expect(fetched?.category?.name).toBe('Electronics')
  })
})
