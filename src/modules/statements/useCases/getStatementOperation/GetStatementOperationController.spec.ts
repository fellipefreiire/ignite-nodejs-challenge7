import request from 'supertest'
import { app } from '@src/app'
import { v4 as uuidv4 } from 'uuid'

import createConnection from '@database/index'
import { Connection } from 'typeorm'

let connection: Connection

describe('Get Statement Operation Controller', () => {
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

  it('should be able to get statement operation', async () => {
    const { body: { token } } = await request(app).post('/api/v1/sessions').send({
      email: 'test@email.com',
      password: 'Test password',
    })

    const response = await request(app).post('/api/v1/statements/deposit').send({
      amount: 100,
      description: 'buy',
    }).set({
      Authorization: `Bearer ${token}`
    })

    const statementResponse = await request(app).get(`/api/v1/statements/${response.body.id}`).set({
      Authorization: `Bearer ${token}`
    })

    expect(statementResponse.status).toBe(200)
    expect(statementResponse.body).toHaveProperty('id')
    expect(statementResponse.body).toHaveProperty('user_id')
    expect(statementResponse.body.type).toEqual('deposit')
  })

  it('should not be able to get statement operation that does not exist', async () => {
    const { body: { token } } = await request(app).post('/api/v1/sessions').send({
      email: 'test@email.com',
      password: 'Test password',
    })

    const response = await request(app).post('/api/v1/statements/deposit').send({
      amount: 100,
      description: 'buy',
    }).set({
      Authorization: `Bearer ${token}`
    })

    const id = uuidv4()

    const statementResponse = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization: `Bearer ${token}`
    })

    expect(statementResponse.status).toBe(404)
  })

  it('should not be able to get statement operation if user does not exist', async () => {
    const { body: { token } } = await request(app).post('/api/v1/sessions').send({
      email: 'test@email.com',
      password: 'Test password',
    })

    const response = await request(app).post('/api/v1/statements/deposit').send({
      amount: 100,
      description: 'buy',
    }).set({
      Authorization: `Bearer ${token}`
    })

    const statementResponse = await request(app).get(`/api/v1/statements/${response.body.id}`).set({
      Authorization: `Bearer Test invalid token`
    })

    expect(statementResponse.status).toBe(401)
  })
})
