import { inject, injectable } from 'tsyringe';
import { sign, verify } from 'jsonwebtoken';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import auth from '@config/auth';
import { AppError } from '@shared/errors/AppError';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';

interface IPaylod {
  sub: string;
  email: string;
}

interface IResponse {
  token: string;
  refresh_token: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute(token: string): Promise<IResponse> {
    const { email, sub } = verify(token, auth.refresh_token_secret) as IPaylod;

    const user_id = sub;

    const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(
      user_id,
      token,
    );

    if (!userToken) {
      throw new AppError('Refresh token does not exist');
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refresh_token = sign({ email }, auth.refresh_token_secret, {
      subject: sub,
      expiresIn: auth.refresh_token_expires_in,
    });

    const refresh_token_expires_date = this.dateProvider.addDays(
      auth.refresh_token_expire_days,
    );

    await this.usersTokensRepository.create({
      user_id,
      refresh_token,
      expires_date: refresh_token_expires_date,
    });

    const newToken = sign({ email }, auth.refresh_token_secret, {
      subject: user_id,
      expiresIn: auth.token_expires_in,
    });

    return {
      token: newToken,
      refresh_token,
    };
  }
}
