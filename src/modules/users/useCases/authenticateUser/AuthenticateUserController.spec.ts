import request from 'supertest'
import { app } from '@src/app'

import createConnection from '@database/index'
import { Connection } from 'typeorm'

let connection: Connection

describe('Authenticate User Controller', () => {
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

  it('should be able to authenticate an user', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'test@email.com',
      password: 'Test password',
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })

  it("should not be able to authenticate user with incorrect email", async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'testwrong@email.com',
      password: 'Test password',
    })

    expect(response.status).toBe(401)
  })

  it("should not be able to authenticate user with incorrect password", async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'test@email.com',
      password: 'Test wrong password',
    })

    expect(response.status).toBe(401)
  })
})
