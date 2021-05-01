import { CarsRepositoryInMemory } from '@modules/cars/repositories/inMemory/CarsRepositoryInMemory';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

describe('List cars', () => {
  let carsRepositoryInMemory: CarsRepositoryInMemory;
  let listAvailableCarsUseCase: ListAvailableCarsUseCase;

  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory,
    );
  });

  it('should be able to list all available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      id: '123123',
      name: 'Car1',
      description: 'Car description',
      daily_rate: 110.0,
      license_plate: 'DFG-1234',
      fine_amount: 40,
      brand: 'Car brand',
      category_id: '14cd56f0-0c90-4282-81c2-bb73b60948e3',
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      id: '123123',
      name: 'Car2',
      description: 'Car description',
      daily_rate: 110.0,
      license_plate: 'ABC-1234',
      fine_amount: 40,
      brand: 'Car brand',
      category_id: '14cd56f0-0c90-4282-81c2-bb73b60948e3',
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'Car2',
    });

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by brand', async () => {
    const car = await carsRepositoryInMemory.create({
      id: '123123',
      name: 'Car3',
      description: 'Car description',
      daily_rate: 110.0,
      license_plate: 'CDF-1234',
      fine_amount: 40,
      brand: 'Car brand',
      category_id: '14cd56f0-0c90-4282-81c2-bb73b60948e3',
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'Car brand',
    });

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by category_id', async () => {
    const car = await carsRepositoryInMemory.create({
      id: '123123',
      name: 'Car3',
      description: 'Car description',
      daily_rate: 110.0,
      license_plate: 'CDF-1234',
      fine_amount: 40,
      brand: 'Car brand',
      category_id: '14cd56f0-0c90-4282-81c2-bb73b60948e3',
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: '14cd56f0-0c90-4282-81c2-bb73b60948e3',
    });

    expect(cars).toEqual([car]);
  });
});
