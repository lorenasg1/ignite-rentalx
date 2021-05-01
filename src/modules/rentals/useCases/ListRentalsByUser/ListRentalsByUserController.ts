import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListRentalsByUserUseCase } from './ListRentalsByUserUseCase';

export class ListRentalsByUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const listUserRentalsUseCase = container.resolve(ListRentalsByUserUseCase);

    const rentalsByUser = await listUserRentalsUseCase.execute(id);

    return response.json(rentalsByUser);
  }
}
