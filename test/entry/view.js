import request from 'supertest';
import assert from 'assert';

import createApp from '../../sr_express/createApp.js';
import { setLogin } from '../util.js';
import { initializeDb } from '../db.js';
import { User } from '../../sr_express/user/model.js';
import { Entry } from '../../sr_express/entry/model.js';
import { generateData, sendData } from '../util.js';

describe('entry/view no login', () => {
  let app;
  before(() => {
    app = createApp();
  });

  it('list', async () => {
    await request(app)
      .get('/entry/list')
      .expect(302);
  });

  it('get create', async () => {
    await request(app)
      .get('/entry/create')
      .expect(302);
  });

  it('post create', async () => {
    await request(app)
      .post('/entry/create')
      .expect(302);
  });
});

describe('entry/view no permission', () => {
  let app;

  beforeEach(async () => {
    await initializeDb();
    let user = await User.create('username1', 'username1');

    app = createApp([setLogin(user)]);
  });

  it('list', async () => {
    await request(app)
      .get('/entry/list')
      .expect(200);
  });

  it('get create', async () => {
    await request(app)
      .get('/entry/create')
      .expect(403);
  });

  it('post create', async () => {
    await request(app)
      .post('/entry/create')
      .expect(403);
  });
});

describe('entry/view', () => {
  let app;
  let entry = {
    title: 'title1',
    content: 'content1'
  }

  beforeEach(async () => {
    await initializeDb();
    let user = await User.create('username1', 'username1');
    await user.addPermissions(['entry.create']);

    app = createApp([setLogin(user)]);
  });

  it('get create', async () => {
    await request(app)
      .get('/entry/create')
      .expect(200);
  });

  it('post create no title', async () => {
    let data = generateData(entry, ['title']);
    await sendData(
      request(app)
        .post('/entry/create'),
      data
    ).expect(200);
  });

  it('post create no content', async () => {
    let data = generateData(entry, ['content']);
    await sendData(
      request(app)
        .post('/entry/create'),
      data
    ).expect(200);
  });

  it('post create', async () => {
    await sendData(
      request(app)
        .post('/entry/create'),
      entry
    ).expect(302);

    assert.equal((await Entry.search()).length, 1);
  });
});