import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UsersRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';
import { CreateUserUseCase } from '../CreateUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate user', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
    );
  });

  it('should be able to authenticate a user', async () => {
    const user: ICreateUserDTO = {
      name: 'User Name',
      email: 'user@email.com',
      password: 'userpassword',
      driver_license: '1234',
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
  });

  it('should not be able to authenticate a non-existent user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'false@email.com',
        password: 'falsepassword',
      }),
    ).rejects.toEqual(new AppError('Email or password incorrect'));
  });

  it('should not be able to authenticate with incorrect password', async () => {
    const user: ICreateUserDTO = {
      name: 'User Name',
      email: 'user@email.com',
      password: 'userpassword',
      driver_license: '1234',
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: 'incorrectpass',
      }),
    ).rejects.toEqual(new AppError('Email or password incorrect'));
  });
});
