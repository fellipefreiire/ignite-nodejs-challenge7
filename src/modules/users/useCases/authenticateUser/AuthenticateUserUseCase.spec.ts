import { AppError } from './../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"


let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Authenticate User', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      name: 'Test user',
      email: 'test@email.com',
      password: 'Test password',
    }

    await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(result).toHaveProperty("token")
  })

  it("should not be able to authenticate user with incorrect email", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test@email.com",
        password: "Test password"
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should not be able to authenticate user with incorrect password", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Test user",
        email: "test@email.com",
        password: "Test password"
      }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "Test password incorrect"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
