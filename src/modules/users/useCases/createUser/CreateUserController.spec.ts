import request from 'supertest'
import { app } from '@src/app'

import createConnection from '@database/index'
import { Connection } from 'typeorm'

let connection: Connection

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'Test user',
      email: 'test@email.com',
      password: 'Test password',
    })

    expect(response.status).toBe(201)
  })

  it("should not be able to create a new user if the user already exists", async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'Test user',
      email: 'test@email.com',
      password: 'Test password',
    })

    expect(response.status).toBe(400)
  })
})
