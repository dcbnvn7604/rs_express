import request from 'supertest';

import createApp from '../../sr_express/createApp.js';
import { sendData, generateData } from '../util.js';
import { initializeDb, clearDb } from '../db.js';
import { User } from '../../sr_express/user/model.js';

describe('user view', () => {
  let register = {
    username: 'username1',
    password: 'password1',
    repassword: 'password1'
  }

  it('authenticate', async () => {
    const app = createApp();
    await request(app)
      .get('/user/login')
      .expect(200);
  });

  it('register', async () => {
    const app = createApp();
    await request(app)
      .get('/user/register')
      .expect(200);
  });

  it('post register no username1', async () => {
    const app = createApp();
    let data = generateData(register, ['username']);
    await sendData(
      request(app)
        .post('/user/register'),
      data
    ).expect(200);
  });

  it ('post register no password', async () => {
    const app = createApp();
    let data = generateData(register, ['password']);
    await sendData(
      request(app)
        .post('/user/register'),
      data
    ).expect(200);
  });

  it ('post register exists', async () => {
    const app = createApp();
    await initializeDb();

    await User.create('username1', 'username1');

    await sendData(
      request(app)
        .post('/user/register'),
      register
    ).expect(200);

    await clearDb();
  });

  it('post register', async () => {
    const app = createApp();
    await initializeDb();

    await sendData(
      request(app)
        .post('/user/register'),
      register
    ).expect(302);

    await clearDb();
  });
});