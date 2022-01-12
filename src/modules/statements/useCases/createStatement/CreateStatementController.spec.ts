import request from 'supertest'
import { app } from '@src/app'

import createConnection from '@database/index'
import { Connection } from 'typeorm'

let connection: Connection

describe('Create Statement Controller', () => {
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

  it('should be able to deposit a statement', async () => {
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

    const balanceResponse = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(balanceResponse.body.balance).toEqual(100)
  })

  it('should be able to withdraw a statement', async () => {
    const { body: { token } } = await request(app).post('/api/v1/sessions').send({
      email: 'test@email.com',
      password: 'Test password',
    })

    const response = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 100,
      description: 'sell',
    }).set({
      Authorization: `Bearer ${token}`
    })

    const balanceResponse = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(balanceResponse.body.balance).toEqual(0)
  })

  it('should not be able to withdraw a statement greater than balance', async () => {
    const { body: { token } } = await request(app).post('/api/v1/sessions').send({
      email: 'test@email.com',
      password: 'Test password',
    })

    const response = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 100,
      description: 'sell',
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(400)
  })
})
