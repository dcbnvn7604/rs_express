import { User } from '../sr_express/user/model.js';
import { Entry } from '../sr_express/entry/model.js';
import db from '../sr_express/db.js';

export async function initializeDb() {
  db.init(process.env.MONGO_HOST, process.env.MONGO_DATABASE, process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD);

  let _db = await db.getInstance();
  let collections = await (await _db.listCollections()).toArray();
  for (const collection of collections) {
    switch(collection['name']) {
      case 'user':
        let userCollection = await User.getCollection();
        await userCollection.drop();
        break;
      case 'entry':
        let entryCollection = await Entry.getCollection();
        await entryCollection.drop();
        break;
    }
  }

  await User.initialize();
};