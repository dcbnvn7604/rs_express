import assert from 'assert';
import { Generator } from '../../sr_express/user/token.js';

describe('user/token/Generator', () => {
  it('create', async () => {
    let generator = new Generator();
    generator.init('secret12341234567890123456789012');
    let token = await generator.create({'username': 'username1'});
    let payload = await generator.verify(token);
    assert.deepEqual(payload, {'username': 'username1'});
  });
});