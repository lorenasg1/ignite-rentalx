import { CarsRepositoryInMemory } from '@modules/cars/repositories/inMemory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/inMemory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';
import dayjs from 'dayjs';
import { CreateRentalUseCase } from './CreateRentalUseCase';

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let createRentalUseCase: CreateRentalUseCase;

describe('Create rental', () => {
  const add24h = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory,
    );
  });

  it('it should be able to create a new rental', async () => {
    const car = await carsRepositoryInMemory.create({
      id: '1231123',
      name: 'car test',
      description: 'Car description test',
      daily_rate: 80,
      license_plate: 'test',
      brand: 'Car brand test',
      fine_amount: 100,
      category_id: 'category-id test',
    });

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      user_id: '12345',
      expected_return_date: add24h,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('it should not be able to create a new rental to the same user', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: 'car_id_test',
      user_id: 'same_user',
      expected_return_date: add24h,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: '121211',
        user_id: 'same_user',
        expected_return_date: add24h,
      }),
    ).rejects.toEqual(new AppError('The user has an open rental'));
  });

  it('it should not be able to create a new rental to the same car', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: 'same_car',
      user_id: '1234567',
      expected_return_date: add24h,
    });

    await expect(
      createRentalUseCase.execute({
        car_id: 'same_car',
        user_id: '12346',
        expected_return_date: add24h,
      }),
    ).rejects.toEqual(new AppError('This car is unavailable'));
  });

  it('it should not be able to create a new rental with invalid time', async () => {
    await expect(
      createRentalUseCase.execute({
        car_id: 'car id',
        user_id: '12345',
        expected_return_date: dayjs().toDate(),
      }),
    ).rejects.toEqual(new AppError('Invalid return time'));
  });
});
