import { CarsRepositoryInMemory } from '@modules/cars/repositories/inMemory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/inMemory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';
import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;
let createCarSpecificationUseCase: CreateCarSpecificationUseCase;

describe('Create car specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory,
    );
  });

  it('should not be able to add a new specification to a non-existent car', async () => {
    const car_id = '123123';
    const specifications_id = ['321321'];

    await expect(
      createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      }),
    ).rejects.toEqual(new AppError('Car does not exist'));
  });

  it('should be able to add a new specification to a car', async () => {
    const car = await carsRepositoryInMemory.create({
      id: '1123',
      name: 'Car name',
      description: 'Car description',
      daily_rate: 80,
      license_plate: 'MZE-0978',
      brand: 'Car brand',
      fine_amount: 100,
      category_id: 'category-id',
    });

    const specification = await specificationsRepositoryInMemory.create({
      name: 'test',
      description: 'test',
    });

    const specifications_id = [specification.id];

    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(specificationsCars).toHaveProperty('specifications');
    expect(specificationsCars.specifications.length).toBe(1);
  });
});
