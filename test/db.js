import { User } from '../sr_express/user/model.js';
import db from '../sr_express/db.js';

export async function initializeDb() {
  let _db = await db.getInstance();
  let collections = await (await _db.listCollections()).toArray();
  for (const collection of collections) {
    switch(collection['name']) {
      case 'user':
        let userCollection = await User.getCollection();
        await userCollection.drop();
        break;
    }
  }

  await User.initialize();
};