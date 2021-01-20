import request from 'supertest';

import createApp from '../../sr_express/createApp.js';
import { generateData } from '../util.js';
import { initializeDb } from '../db.js';
import { User } from '../../sr_express/user/model.js';

describe('api/user', () => {
  let app;

  before(() => {
    app = createApp();
  });

  let login = {
    username: 'username1',
    password: 'password1',
  };

  it('authenticate', async () => {
    await initializeDb();
    await User.create(login.username, login.password);

    await request(app)
      .post('/api/user/authenticate')
      .send(login)
      .expect(200);
  });

  it('authenticate no user', async () => {
    await initializeDb();
    await request(app)
      .post('/api/user/authenticate')
      .send(login)
      .expect(400);
  });

  it('authenticate no username', async () => {
    await request(app)
      .post('/api/user/authenticate')
      .send(generateData(login, ['username']))
      .expect(400);
  });

  it('authenticate no password', async () => {
    await request(app)
      .post('/api/user/authenticate')
      .send(generateData(login, ['password']))
      .expect(400);
  });
});