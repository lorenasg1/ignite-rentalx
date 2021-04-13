import 'reflect-metadata';
import express, { json } from 'express';
import swaggerUi from 'swagger-ui-express';

import { router } from './routes';
import swaggerFile from './swagger.json';

import './database';
import './shared/container';

const app = express();
app.use(json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

export { app };
