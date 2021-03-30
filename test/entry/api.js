import request from 'supertest';

import createApp from '../../sr_express/createApp.js';
import generator from '../../sr_express/user/token.js';
import { initializeDb } from '../db.js';
import { generateData } from '../util.js';
import { User } from '../../sr_express/user/model.js';

describe('entry/api no token', () => {
  let app;

  let entry = {
    title: 'title1',
    content: 'content1'
  };

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

  it('create', async () => {
    await request(app)
      .post('/api/entry')
      .send(entry)
      .expect(401);
  });

  it('create wrong token', async () => {
    await request(app)
      .post('/api/entry')
      .set('Authorization', 'Bearer token')
      .send(entry)
      .expect(401);
  });
});

describe('entry/api', () => {
  let app;
  let token;
  let user;

  let login = {
    username: 'username1',
    password: 'password1',
  };

  let entry = {
    title: 'title1',
    content: 'content1'
  };


  before(() => {
    app = createApp();
  });

  beforeEach(async () => {
    await initializeDb();
    user = await User.create(login.username, login.password);
    token = await generator.create({'username': login.username});
  });

  it('list', async () => {
    await request(app)
      .get('/api/entry')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('create no permission', async () => {
    await request(app)
      .post('/api/entry')
      .set('Authorization', `Bearer ${token}`)
      .send(entry)
      .expect(403);
  });

  it('create validate error', async () => {
    await user.addPermissions(['entry.create']);

    await request(app)
      .post('/api/entry')
      .set('Authorization', `Bearer ${token}`)
      .send(generateData(entry, ['title']))
      .expect(400)
      .expect(response => {
        if (!('title' in  response.body)) throw new Error("title");
      });
  });

  it('create', async () => {
    await user.addPermissions(['entry.create']);

    await request(app)
      .post('/api/entry')
      .set('Authorization', `Bearer ${token}`)
      .send(entry)
      .expect(201);
  });
});