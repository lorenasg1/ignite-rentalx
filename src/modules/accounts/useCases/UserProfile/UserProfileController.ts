import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UserProfileUseCase } from './UserProfileUseCase';

export class UserProfileController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const userProfileUseCase = container.resolve(UserProfileUseCase);

    const userProfile = await userProfileUseCase.execute(id);

    return response.json(userProfile);
  }
}
