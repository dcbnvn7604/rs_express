import request from 'supertest';

import createApp from '../../sr_express/createApp.js';
import generator from '../../sr_express/user/token.js';
import { initializeDb } from '../db.js';
import { User } from '../../sr_express/user/model.js';

describe('entry/api no token', () => {
  let app;

  before(() => {
    app = createApp();
  });

  it('list', async () => {
    await request(app)
      .get('/api/entry')
      .expect(401);
  });

  it('list wrong token', async () => {
    await request(app)
      .get('/api/entry')
      .set('Authorization', 'Bearer token')
      .expect(401);
  });
});

describe('entry/api', () => {
  let app;
  let login = {
    username: 'username1',
    password: 'password1',
  };

  before(() => {
    app = createApp();
  });

  it.only('list', async () => {
    await initializeDb();
    await User.create(login.username, login.password);
    let token = await generator.create({'username': login.username});

    await request(app)
      .get('/api/entry')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});