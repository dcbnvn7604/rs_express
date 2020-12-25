import request from 'supertest';

import createApp from '../../sr_express/createApp.js';
import { sendData, generateData, setLogin } from '../util.js';
import { initializeDb } from '../db.js';
import { User } from '../../sr_express/user/model.js';

describe('user/view no login', () => {
  let app;

  let register = {
    username: 'username1',
    password: 'password1',
    repassword: 'password1'
  }

  let login = {
    username: 'username1',
    password: 'password1',
  };

  before(() => {
    app = createApp();
  });

  it('authenticate', async () => {
    await request(app)
      .get('/user/login')
      .expect(200);
  });

  it('post authenticate no username', async () => {
    let data = generateData(login, ['username']);

    await sendData(
      request(app).post('/user/login'),
      data
    ).expect(200);
  });

  it('post authenticate no password', async () => {
    let data = generateData(login, ['password']);

    await sendData(
      request(app).post('/user/login'),
      data
    ).expect(200);
  });

  it('post authenticate no user', async () => {
    await initializeDb();

    await sendData(
      request(app).post('/user/login'),
      login
    ).expect(200);
  });

  it('post authenticate', async () => {
    await initializeDb();
    await User.create('username1', 'password1');

    await sendData(
      request(app).post('/user/login'),
      login
    ).expect(302);
  });

  it('post logout no login', async () => {
    await initializeDb();

    await request(app).post('/user/logout')
      .expect(302);
  });

  it('register', async () => {
    await request(app)
      .get('/user/register')
      .expect(200);
  });

  it('post register no username', async () => {
    let data = generateData(register, ['username']);
    await sendData(
      request(app)
        .post('/user/register'),
      data
    ).expect(200);
  });

  it ('post register no password', async () => {
    let data = generateData(register, ['password']);
    await sendData(
      request(app)
        .post('/user/register'),
      data
    ).expect(200);
  });

  it ('post register exists', async () => {
    await initializeDb();
    await User.create('username1', 'username1');

    await sendData(
      request(app)
        .post('/user/register'),
      register
    ).expect(200);
  });

  it('post register', async () => {
    await initializeDb();

    await sendData(
      request(app)
        .post('/user/register'),
      register
    ).expect(302);
  });
});

describe('user/view', () => {
  let app;

  before(async () => {
    await initializeDb();
    let user = await User.create('username1', 'username1');

    app = createApp([setLogin(user)]);
  });

  it('post logout', async () => {
    await request(app).post('/user/logout')
      .expect(302);
  });
});