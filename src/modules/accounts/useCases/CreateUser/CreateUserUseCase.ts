import { inject, injectable } from 'tsyringe';
import { hash } from 'bcrypt';

import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { AppError } from '../../../../errors/AppError';

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
