import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { AppError } from '@shared/errors/AppError';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let getStatementOperationUseCase: GetStatementOperationUseCase

describe('Get Statement Operation', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should be able to get statement operation', async () => {
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

    const statementOperation = await getStatementOperationUseCase.execute({
      statement_id: deposit.id,
      user_id: user.id
    })

    expect(statementOperation).toEqual(deposit)
  })

  it('should not be able to get statement operation that does not exist', async () => {
    await expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'Test user',
        email: 'test@email.com',
        password: 'Test password',
      })

      await getStatementOperationUseCase.execute({
        statement_id: "Test statement id",
        user_id: user.id
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to get statement operation if user does not exist', async () => {
    await expect(async () => {
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

      await getStatementOperationUseCase.execute({
        statement_id: deposit.id,
        user_id: "Test user id"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
