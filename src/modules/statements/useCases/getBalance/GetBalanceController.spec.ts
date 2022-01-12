import request from 'supertest'
import { app } from '@src/app'

import createConnection from '@database/index'
import { Connection } from 'typeorm'

let connection: Connection

describe('Get Balance Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()

    await request(app).post('/api/v1/users').send({
      name: 'Test user',
      email: 'test@email.com',
      password: 'Test password',
    })
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to get balance from user account', async () => {
    const { body: { token } } = await request(app).post('/api/v1/sessions').send({
      email: 'test@email.com',
      password: 'Test password',
    })

    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('statement')
    expect(response.body).toHaveProperty('balance')
  })

  it('should not be able to get balance from a user that does not exist', async () => {
    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer invalidToken`
    })

    expect(response.status).toBe(401)
  })
})
