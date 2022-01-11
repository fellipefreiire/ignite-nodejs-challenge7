import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AppError } from "@shared/errors/AppError"
import { CreateUserUseCase } from "./CreateUserUseCase"


let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Test user',
      email: 'test@email.com',
      password: 'Test password',
    })

    expect(user).toHaveProperty('id')
  })

  it("should not be able to create a new user if the user already exists", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'Test user',
        email: 'test@email.com',
        password: 'Test password',
      })

      await createUserUseCase.execute({
        name: 'Test user',
        email: 'test@email.com',
        password: 'Test password',
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
