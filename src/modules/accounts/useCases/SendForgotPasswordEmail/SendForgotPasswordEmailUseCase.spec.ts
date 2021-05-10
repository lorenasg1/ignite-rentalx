import { UsersRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/inMemory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/inMemory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';
import { SendForgotPasswordEmailUseCase } from './SendForgotPasswordEmailUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;
let sendForgotPasswordEmailUseCase: SendForgotPasswordEmailUseCase;

describe('Send forgot email password', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordEmailUseCase = new SendForgotPasswordEmailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider,
    );
  });

  it('should be able to send forgot password email to user', async () => {
    const sendMail = spyOn(mailProvider, 'sendMail');

    await usersRepositoryInMemory.create({
      name: 'Craig',
      email: 'kihimgo@ub.bz',
      password: '123123',
      driver_license: 'xC6sSR',
    });

    await sendForgotPasswordEmailUseCase.execute('kihimgo@ub.bz');

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send forgot password email if user does not exist', async () => {
    await expect(
      sendForgotPasswordEmailUseCase.execute('wehlov@icke.uz'),
    ).rejects.toEqual(new AppError('User does not exist'));
  });

  it('should be able to create a user token', async () => {
    const generateToken = spyOn(usersTokensRepositoryInMemory, 'create');

    await usersRepositoryInMemory.create({
      name: 'Mattie',
      email: 'cekhizdef@ki.ly',
      password: '123123',
      driver_license: '098852',
    });

    await sendForgotPasswordEmailUseCase.execute('cekhizdef@ki.ly');

    expect(generateToken).toHaveBeenCalled();
  });

  it('should not be able to send forgot password email if user does not exist', async () => {
    await expect(
      sendForgotPasswordEmailUseCase.execute('wehlov@icke.uz'),
    ).rejects.toEqual(new AppError('User does not exist'));
  });
});
