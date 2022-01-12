import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { CreateUserUseCase } from './../createUser/CreateUserUseCase';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';


let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase

describe('Show user profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to show user profile', async () => {
    const user = await createUserUseCase.execute({
      name: 'Test user',
      email: 'test@email.com',
      password: 'Test password',
    })

    const userProfile = await showUserProfileUseCase.execute(user.id)

    expect(userProfile).toEqual(user)
  })

  //TODO Show Profile Error
  // it('should not be able to show invalid user profile', async () => {
  //   const userProfile = await showUserProfileUseCase.execute("Test user id")
  //   console.log(userProfile)

  //   expect(userProfile).toEqual(null)
  // })
})
