import { User } from '../sr_express/user/model.js';

export async function initializeDb() {
  await User.initialize();
};

export async function clearDb() {
  let userCollection = await User.getCollection();
  await userCollection.drop();
}