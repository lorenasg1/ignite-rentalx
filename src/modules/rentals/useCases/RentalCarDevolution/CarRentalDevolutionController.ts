import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CarRentalDevolutionUseCase } from './CarRentalDevolutionUseCase';

export class CarRentalDevolutionController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id: user_id } = request.user;

    const carRentalDevolutionUseCase = container.resolve(
      CarRentalDevolutionUseCase,
    );

    const carRentalDevolution = await carRentalDevolutionUseCase.execute({
      id,
      user_id,
    });

    return response.json(carRentalDevolution);
  }
}
