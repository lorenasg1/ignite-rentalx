import express, { json } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger.json';

import { router } from './routes';

const app = express();
app.use(json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.listen(3333, () => console.log('🚀 Server is running on port 3333!'));
