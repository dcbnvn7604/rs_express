import request from 'supertest';

import createApp from '../../sr_express/createApp.js';
import { setLogin } from '../util.js';
import { initializeDb } from '../db.js';
import { User } from '../../sr_express/user/model.js';

describe('entry view', () => {
  it('list no login', async () => {
    let app = createApp();

    await request(app)
      .get('/entry/list')
      .expect(302);
  });

  it('list', async () => {
    await initializeDb();
    let user = await User.create('username1', 'username1');

    let app = createApp([setLogin(user)]);

    await request(app)
      .get('/entry/list')
      .expect(200);
  });
});