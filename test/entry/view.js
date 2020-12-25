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

  it('get update', async () => {
    await request(app)
      .get('/entry/1/update')
      .expect(302);
  });

  it('post delete', async () => {
    await request(app)
      .post('/entry/1/delete')
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

  it('get update', async () => {
    await request(app)
      .get('/entry/1/update')
      .expect(403);
  });

  it('post delete', async () => {
    await request(app)
      .post('/entry/1/delete')
      .expect(403);
  });
});

describe('entry/view/create', () => {
  let app;
  let entry = {
    title: 'title1',
    content: 'content1'
  };

  beforeEach(async () => {
    await initializeDb();
    let user = await User.create('username1', 'username1');
    await user.addPermissions(['entry.create']);

    app = createApp([setLogin(user)]);
  });

  it('get', async () => {
    await request(app)
      .get('/entry/create')
      .expect(200);
  });

  it('post no title', async () => {
    let data = generateData(entry, ['title']);
    await sendData(
      request(app)
        .post('/entry/create'),
      data
    ).expect(200);
  });

  it('post no content', async () => {
    let data = generateData(entry, ['content']);
    await sendData(
      request(app)
        .post('/entry/create'),
      data
    ).expect(200);
  });

  it('post', async () => {
    await sendData(
      request(app)
        .post('/entry/create'),
      entry
    ).expect(302);

    assert.equal((await Entry.search()).length, 1);
  });
});

describe('entry/view/update', () => {
  let app;
  let user;
  let entry = {
    title: 'title1',
    content: 'content1'
  };

  beforeEach(async () => {
    await initializeDb();
    user = await User.create('username1', 'username1');
    await user.addPermissions(['entry.update']);

    app = createApp([setLogin(user)]);
  });

  it('get no exists', async () => {
    await request(app)
      .get('/entry/123456789012/update')
      .expect(404);
  });

  it('get', async () => {
    let entry = await Entry.create('title1', 'content1', user);
    await request(app)
      .get(`/entry/${entry.id}/update`)
      .expect(200);
  });

  it('post no title', async () => {
    let data = generateData(entry, ['title']);
    await sendData(
      request(app)
        .post('/entry/1/update'),
      data
    ).expect(200);
  });

  it('post no content', async () => {
    let data = generateData(entry, ['content']);
    await sendData(
      request(app)
        .post('/entry/1/update'),
      data
    ).expect(200);
  });

  it('post no exists', async () => {
    await sendData(
      request(app)
        .post('/entry/123456789012/update'),
      entry
    ).expect(404);
  });

  it('post', async () => {
    let _entry = await Entry.create('title2', 'content2', user);
    await sendData(
      request(app)
        .post(`/entry/${_entry.id}/update`),
      entry
    ).expect(302);
  });
});

describe('entry/view/delete', () => {
  let app;
  let user;

  beforeEach(async () => {
    await initializeDb();
    user = await User.create('username1', 'username1');
    await user.addPermissions(['entry.delete']);

    app = createApp([setLogin(user)]);
  });

  it('post no exists', async () => {
    await request(app)
      .post('/entry/123456789012/delete')
      .expect(404);
  });

  it('post', async () => {
    let _entry = await Entry.create('title2', 'content2', user);
    await request(app)
      .post(`/entry/${_entry.id}/delete`)
      .expect(302);
  });
});