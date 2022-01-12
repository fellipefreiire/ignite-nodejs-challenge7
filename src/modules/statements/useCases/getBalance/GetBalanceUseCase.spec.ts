import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { GetBalanceUseCase } from './GetBalanceUseCase';

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let getBalanceUseCase: GetBalanceUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
  })

  it('should be able to get balance from user account', async () => {
    const user = await createUserUseCase.execute({
      name: 'Test user',
      email: 'test@email.com',
      password: 'Test password',
    })

    const balance = await getBalanceUseCase.execute({
      user_id: user.id,
    })

    expect(balance).toHaveProperty('statement')
    expect(balance).toHaveProperty('balance')
  })

  //TODO Get balance error
  it('should not be able to get balance from a user that does not exist', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "123"
      })
    }).toBeInstanceOf(AppError)
  })
})
