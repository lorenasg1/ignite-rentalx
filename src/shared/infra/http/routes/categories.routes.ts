import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import { CreateCategoryController } from '@modules/cars/useCases/CreateCategory/CreateCategoryController';
import { ImportCategoryController } from '@modules/cars/useCases/ImportCategory/ImportCategoryController';
import { ListCategoriesController } from '@modules/cars/useCases/ListCategories/ListCategoriesController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureAdmin } from '../middlewares/ensureAdmin';

const categoriesRoutes = Router();

const uploadCategories = multer(uploadConfig.upload('./tmp'));

const createCategoryController = new CreateCategoryController();
const importCategoryController = new ImportCategoryController();
const listCategoriesController = new ListCategoriesController();

categoriesRoutes.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  createCategoryController.handle,
);

categoriesRoutes.get('/', listCategoriesController.handle);

categoriesRoutes.post(
  '/import',
  ensureAuthenticated,
  ensureAdmin,
  uploadCategories.single('file'),
  importCategoryController.handle,
);

export { categoriesRoutes };
