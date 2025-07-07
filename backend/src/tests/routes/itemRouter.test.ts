import express from 'express'
import request from 'supertest'

import { Category, Department, Item, Permission, Role, User } from '@/models'
import mainRouter from '@/routes'

const app = express()
app.use(express.json())
app.use(mainRouter)

let user: User,
  category: Category,
  department: Department,
  item: Item,
  role: Role,
  permissions: Permission[]

beforeEach(async () => {
  // Insert test data
  user = await User.create(
    { username: 'Test', passwordHash: 'pass' },
    { userId: 0 }
  )
  role = await Role.create({ name: 'Test Role' }, { userId: user.id })

  // Create all necessary permissions
  permissions = await Permission.bulkCreate(
    [
      { name: 'create_item', description: 'Allows creating items' },
      { name: 'get_item', description: 'Allows getting items' },
      { name: 'edit_item', description: 'Allows editing items' },
      { name: 'delete_item', description: 'Allows deleting items' },
    ],
    { userId: user.id }
  )

  // Assign all permissions to the role
  await role.$add(Role.RELATIONS.PERMISSIONS, permissions, { userId: user.id })
  await user.$add(User.RELATIONS.ROLES, role, { userId: user.id })

  department = await Department.create(
    { name: 'Test Department' },
    { userId: user.id }
  )
  category = await Category.create(
    { name: 'Test Category' },
    { userId: user.id }
  )
  item = await Item.create(
    { name: 'Test Item', departmentId: department.id, categoryId: category.id },
    { userId: user.id }
  )
})

describe('Item Routes', () => {
  it('should create a item with valid authentication and authorization', async () => {
    // Simulate login to get a token
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'Test', password: 'pass' })

    const token = loginResponse.body.token

    const response = await request(app)
      .post('/items')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Item',
        departmentId: department.id,
        userId: user.id,
        quantity: 10,
        unit: 'und.',
        categoryId: category.id,
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('name', 'New Item')
    expect(response.body).toHaveProperty('departmentId', department.id)
    expect(response.body).toHaveProperty('quantity', 10)
    expect(response.body).toHaveProperty('unit', 'und.')
    expect(response.body).toHaveProperty('categoryId', category.id)
  })

  it('shoult create an item with only required data with valid authentication and authorization', async () => {
    // Simulate login to get a token
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'Test', password: 'pass' })

    const token = loginResponse.body.token

    const response = await request(app)
      .post('/items')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Item',
        departmentId: department.id,
        userId: user.id,
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('name', 'New Item')
    expect(response.body).toHaveProperty('departmentId', department.id)
    expect(response.body).toHaveProperty('quantity', 1)
    expect(response.body).toHaveProperty('unit', 'und.')
  })

  it('should get a item by ID with valid authentication and authorization', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'Test', password: 'pass' })

    const token = loginResponse.body.token

    const response = await request(app)
      .get(`/items/${item.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('name', 'Test Item')
  })

  it('should return 404 for a non-existent item', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'Test', password: 'pass' })

    const token = loginResponse.body.token

    const response = await request(app)
      .get('/items/9999')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('error', 'Item not found')
  })

  it('should get all items with pagination', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'Test', password: 'pass' })

    const token = loginResponse.body.token

    const response = await request(app)
      .get('/items?page=1&pageSize=1')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data.length).toBeGreaterThanOrEqual(0)
  })

  it('should get all changelogs for itemId with pagination', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'Test', password: 'pass' })

    const token = loginResponse.body.token

    const response = await request(app)
      .get(`/items/changelogs/${item.id}?page=1&pageSize=1`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data.length).toBeGreaterThanOrEqual(0)
  })

  it('should update a item with valid authentication and authorization', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'Test', password: 'pass' })

    const token = loginResponse.body.token

    const response = await request(app)
      .put(`/items/${item.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Item',
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('name', 'Updated Item')
  })

  it('should delete a item with valid authentication and authorization', async () => {
    // Create item that has no associations
    const deleteItem = await Item.create(
      { name: 'deleteitem', departmentId: department.id },
      { userId: user.id }
    )

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'Test', password: 'pass' })

    const token = loginResponse.body.token

    const response = await request(app)
      .delete(`/items/${deleteItem.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })

  it('should return 401 if not authenticated', async () => {
    const response = await request(app).get(`/items/${item.id}`)
    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message', 'Token not provided')
  })

  it('should return 403 if not authorized', async () => {
    // Create a user without the necessary permissions
    await User.create(
      { username: 'Unauthorized', passwordHash: 'pass' },
      { userId: user.id }
    )

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'Unauthorized', password: 'pass' })

    const token = loginResponse.body.token

    const response = await request(app)
      .post('/items')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Unauthorized Item',
        departmentId: department.id,
        userId: user.id,
      })

    expect(response.status).toBe(403)
    expect(response.body).toHaveProperty('error', 'Forbidden')
  })
})
