import { CarsRepositoryInMemory } from '@modules/cars/repositories/inMemory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';
import { CreateCarUseCase } from './CreateCarUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let createCarUseCase: CreateCarUseCase;

describe('Create car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('should be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      id: '1231123',
      name: 'Car name',
      description: 'Car description',
      daily_rate: 80,
      license_plate: 'MZE0978',
      brand: 'Car brand',
      fine_amount: 100,
      category_id: 'category-id',
    });

    expect(car).toHaveProperty('id');
  });

  it('should not be able to create a new car with an existing license plate', async () => {
    await createCarUseCase.execute({
      id: '123123',
      name: 'Car name',
      description: 'Car description',
      daily_rate: 80,
      license_plate: 'MZE-0978',
      brand: 'Car brand',
      fine_amount: 100,
      category_id: 'category-id',
    });

    await expect(
      createCarUseCase.execute({
        id: '123123',
        name: 'Car name2',
        description: 'Car description',
        daily_rate: 80,
        license_plate: 'MZE-0978',
        brand: 'Car brand',
        fine_amount: 100,
        category_id: 'category-id',
      }),
    ).rejects.toEqual(new AppError('Car already exists'));
  });

  it('should be able to create an available car', async () => {
    const car = await createCarUseCase.execute({
      id: '123123',
      name: 'available-car',
      description: 'Car description',
      daily_rate: 80,
      license_plate: 'MZE-0978',
      brand: 'Car brand',
      fine_amount: 100,
      category_id: 'category-id',
    });

    expect(car.available).toBe(true);
  });
});
