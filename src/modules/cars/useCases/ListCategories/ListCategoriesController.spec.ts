import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('List All Categories Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, is_admin, created_at, driver_license) VALUES('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'xxxxx')`,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to list all categories', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const category = await request(app)
      .post('/categories')
      .send({
        name: 'category name1',
        description: 'category description1',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app).get('/categories').send();

    expect(response.status).toBe(200);
  });
});
