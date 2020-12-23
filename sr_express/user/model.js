import bcrypt from 'bcrypt';

import db from '../db.js';
import { UnauthenticateException } from './exception.js';

const SALT_ROUND = 10;

export class User {
  static #collection = null;

  static async initialize() {
    let collection = await User.getCollection();
    await collection.createIndex({username: 1}, {unique: 1});
  }

  static async getCollection() {
    return await (await db.getInstance()).collection('user');
  }

  static async exists(username) {
    let collection = await User.getCollection();
    return !!(await collection.countDocuments({username}));
  }

  static async authenticate(username, password) {
    let collection = await User.getCollection();
    let cursor = collection.find({username})
    if(await cursor.hasNext()) {
      let user = await cursor.next();
      let match = await bcrypt.compare(password, user.password);
      if (match) {
        return user;
      }
    }
    throw new UnauthenticateException();
  }

  static async create(username, password) {
    let hashed = await bcrypt.hash(password, SALT_ROUND);
    let collection = await User.getCollection();
    await collection.insertOne({
      username,
      password: hashed
    });
  }
}