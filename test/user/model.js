import assert from 'assert';

import { User } from '../../sr_express/user/model.js';
import { initializeDb } from '../db.js';

describe('user model', () => {
  it('addPermissions', async () => {
    await initializeDb();

    let user = await User.create('username1', 'password1', []);
    await user.addPermissions(['entry.create']);
    await user.addPermissions(['entry.update']);
    assert.equal(user.hasPermissions(['entry.create', 'entry.update']), true);
  });
});