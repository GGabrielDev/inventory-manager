import Category from './Category'
import Department from './Department'
import Item from './Item'

export const Models = [Category, Department, Item]

export const RELATIONS = {
  CATEGORY: 'category',
  DEPARTMENT: 'department',
  ITEM: 'item',
}

export { Category, Department, Item }
