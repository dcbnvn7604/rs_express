import bcrypt from 'bcrypt';

import db from '../db.js';
import { UnauthenticateException } from './exception.js';

const SALT_ROUND = 10;

export class User {
  #id;
  #username;

  constructor(id, username) {
    this.#id = id;
    this.#username = username;
  }

  get id() {
    return this.#id;
  }

  get username() {
    return this.#username;
  }

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
        return new User(user._id, user.username);
      }
    }
    throw new UnauthenticateException();
  }

  static async create(username, password) {
    let hashed = await bcrypt.hash(password, SALT_ROUND);
    let collection = await User.getCollection();
    let result = await collection.insertOne({
      username,
      password: hashed
    });
    return new User(result.insertedId, username);
  }
}