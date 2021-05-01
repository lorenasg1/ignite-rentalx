import { inject, injectable } from 'tsyringe';
import { hash } from 'bcrypt';

import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    name,
    email,
    password,
    driver_license,
  }: ICreateUserDTO): Promise<void> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new AppError('User already exists');
    }

    const passwordHash = await hash(password, 8);

    this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      driver_license,
    });
  }
}
