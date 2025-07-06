import { ChangeLog, Item, User } from '@/models'
import { UnitType } from '@/models/Item'

interface PaginationOptions {
  page: number
  pageSize: number
}

interface PaginatedResult<T> {
  data: T[]
  total: number
  totalPages: number
  currentPage: number
}

export class ItemController {
  // Create a new item
  static async createItem(
    name: Item['name'],
    departmentId: Item['departmentId'],
    userId: User['id'],
    quantity: Item['quantity'] = 1,
    unit: Item['unit'] = UnitType.UND,
    categoryId?: Item['categoryId']
  ): Promise<Item> {
    if (!name) {
      throw new Error('Validation error: Item name is required')
    }
    if (typeof departmentId !== 'number' || departmentId < 0) {
      throw new Error('Invalid departmentId')
    }
    if (typeof userId !== 'number' || userId < 0) {
      throw new Error('Invalid userId')
    }
    if (quantity < 1) {
      throw new Error('Validation error: Quantity must be at least 1')
    }
    if (!Object.values(UnitType).includes(unit)) {
      throw new Error(`Invalid unit: ${unit}`)
    }

    return Item.create(
      { name, departmentId, quantity, unit, categoryId },
      { userId }
    )
  }

  // Get an item by ID
  static async getItemById(itemId: number): Promise<Item | null> {
    if (typeof itemId !== 'number' || isNaN(itemId)) {
      throw new Error('Invalid itemId')
    }

    return Item.findByPk(itemId, {
      include: [
        Item.RELATIONS.CATEGORY,
        Item.RELATIONS.DEPARTMENT,
        {
          model: ChangeLog,
          as: Item.RELATIONS.CHANGELOGS,
          include: [ChangeLog.RELATIONS.CHANGELOG_DETAILS],
        },
      ],
    })
  }

  // Get all items with pagination
  static async getAllItems({
    page,
    pageSize,
  }: PaginationOptions): Promise<PaginatedResult<Item>> {
    if (page < 1 || pageSize < 1) {
      return {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: page,
      }
    }

    const offset = (page - 1) * pageSize
    const { count, rows } = await Item.findAndCountAll({
      offset,
      limit: pageSize,
      include: [Item.RELATIONS.CATEGORY, Item.RELATIONS.DEPARTMENT],
    })

    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
    }
  }

  // Update an item
  static async updateItem(
    itemId: number,
    updates: Partial<Item>,
    actionUserId: number
  ): Promise<Item | null> {
    if (typeof itemId !== 'number' || isNaN(itemId)) {
      throw new Error('Invalid itemId')
    }

    const item = await Item.findByPk(itemId)
    if (!item) return null

    await item.update(updates, { userId: actionUserId })
    return item
  }

  // Delete an item
  static async deleteItem(
    itemId: number,
    actionUserId: number
  ): Promise<boolean> {
    if (typeof itemId !== 'number' || isNaN(itemId)) {
      throw new Error('Invalid itemId')
    }

    const item = await Item.findByPk(itemId)
    if (!item) return false

    await item.destroy({ userId: actionUserId })
    return true
  }
}
