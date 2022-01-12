import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceUseCase } from './../getBalance/GetBalanceUseCase';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { AppError } from '@shared/errors/AppError';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let getBalanceUseCase: GetBalanceUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should be able to deposit a statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'Test user',
      email: 'test@email.com',
      password: 'Test password',
    })

    const deposit = await createStatementUseCase.execute({
      amount: 100,
      description: "Test deposit",
      type: "deposit" as OperationType,
      user_id: user.id
    })

    const balance = await getBalanceUseCase.execute({
      user_id: user.id,
    })

    expect(deposit).toHaveProperty('id')
    expect(balance.balance).toEqual(100)
  })

  it('should be able to withdraw a statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'Test user',
      email: 'test@email.com',
      password: 'Test password',
    })

    await createStatementUseCase.execute({
      amount: 100,
      description: "Test deposit",
      type: "deposit" as OperationType,
      user_id: user.id
    })

    const withdraw = await createStatementUseCase.execute({
      amount: 50,
      description: "Test withdraw",
      type: "withdraw" as OperationType,
      user_id: user.id
    })

    const balance = await getBalanceUseCase.execute({
      user_id: user.id,
    })

    expect(withdraw).toHaveProperty('id')
    expect(balance.balance).toEqual(50)
  })

  //TODO Create withdraw statement error
  // it('should be able to withdraw a statement greater than balance', async () => {
  //   expect(async () => {
  //     const user = await createUserUseCase.execute({
  //       name: 'Test user',
  //       email: 'test@email.com',
  //       password: 'Test password',
  //     })

  //     await createStatementUseCase.execute({
  //       amount: 50,
  //       description: "Test deposit",
  //       type: "deposit" as OperationType,
  //       user_id: user.id
  //     })

  //     await createStatementUseCase.execute({
  //       amount: 100,
  //       description: "Test withdraw",
  //       type: "withdraw" as OperationType,
  //       user_id: user.id
  //     })
  //   }).toBeInstanceOf(AppError)
  // })
})
