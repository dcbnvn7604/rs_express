import assert from 'assert';

import { Entry } from '../../sr_express/entry/model.js';
import { User } from '../../sr_express/user/model.js';
import { initializeDb } from '../db.js';

describe('entry model', () => {
  it('search', async () => {
    await initializeDb();

    let user = await User.create('username1', 'password1');
    await Entry.create('title1', 'content', user);
    await Entry.create('title', 'content2', user);

    let entries = await Entry.search();
    assert.equal(entries.length, 2);

    entries = await Entry.search('1');
    assert.equal(entries[0].title, 'title1');

    entries = await Entry.search('2');
    assert.equal(entries[0].content, 'content2');
  });
});