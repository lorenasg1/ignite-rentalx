import dayjs from 'dayjs';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/inMemory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';
import { CreateRentalUseCase } from './CreateRentalUseCase';

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let createRentalUseCase: CreateRentalUseCase;

describe('Create rental', () => {
  const add24h = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
    );
  });

  it('it should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      car_id: '121212',
      user_id: '12345',
      expected_return_date: add24h,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('it should not be able to create a new rental to the same user', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: '121212',
        user_id: '12345',
        expected_return_date: add24h,
      });

      await createRentalUseCase.execute({
        car_id: '121211',
        user_id: '12345',
        expected_return_date: add24h,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('it should not be able to create a new rental to the same car', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: 'car id',
        user_id: '12345',
        expected_return_date: add24h,
      });

      await createRentalUseCase.execute({
        car_id: 'car id',
        user_id: '12346',
        expected_return_date: add24h,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('it should not be able to create a new rental with invalid time', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        car_id: 'car id',
        user_id: '12345',
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
