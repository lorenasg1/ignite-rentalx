import { CategoriesRepositoryInMemory } from '@modules/cars/repositories/inMemory/CategoriesRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe('Create category', () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory,
    );
  });

  it('should be able to crete a new category', async () => {
    const category = {
      name: 'Category name',
      description: 'Category description',
    };

    await createCategoryUseCase.execute({
      name: category.name,
      description: category.description,
    });

    const createdCategory = await categoriesRepositoryInMemory.findByName(
      category.name,
    );

    expect(createdCategory).toHaveProperty('id');
  });

  it('should not be able to crete a category with an existing name', async () => {
    const category = {
      name: 'Category name',
      description: 'Category description',
    };

    await createCategoryUseCase.execute({
      name: category.name,
      description: category.description,
    });

    await expect(
      createCategoryUseCase.execute({
        name: category.name,
        description: category.description,
      }),
    ).rejects.toEqual(new AppError('Category already exists'));
  });
});
