import 'reflect-metadata';
import '@shared/container';
import express, { json, NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';

import { AppError } from '@shared/errors/AppError';
import { router } from '@shared/infra/http/routes';
import swaggerFile from '../../../swagger.json';
import createConnection from '@shared/infra/typeorm';

createConnection();
const app = express();
app.use(json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({ message: err.message });
    }

    return response.status(500).json({
      status: 'error',
      message: `Internal server error - ${err.message}`,
    });
  },
);

export { app };
