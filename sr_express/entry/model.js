import mongodb from 'mongodb';

import db from '../db.js';
import { NotFoundException } from '../exception.js';

export class Entry {
  #id;
  #title;
  #content;

  constructor(id, title, content) {
    this.#id = id;
    this.#title = title;
    this.#content = content;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get content() {
    return this.#content;
  }

  async update(title, content) {
    let collection = await Entry.getCollection();
    await collection.updateOne({_id: this.#id}, {$set: {title, content}});
  }

  static async getCollection() {
    return await (await db.getInstance()).collection('entry');
  }

  static async create(title, content, user) {
    let collection = await Entry.getCollection();
    let result = await collection.insertOne({title, content, _user_id: user.id});
    return new Entry(result.insertedId, title, content);
  }

  static async search(query) {
    let collection = await Entry.getCollection();
    let reQuey = new RegExp(`${query}`);
    let condition = {};
    if (query) {
      condition = {$or: [{title: reQuey}, {content: reQuey}]};
    }
    return (await collection.find(condition).toArray()).map((entry) => {
      return new Entry(entry._id, entry.title, entry.content);
    });
  }

  static async byId(id) {
    let collection = await Entry.getCollection();
    let entry = await collection.findOne({_id: mongodb.ObjectId(id)});
    if (!entry) {
      throw new NotFoundException();
    }
    return new Entry(entry._id, entry.title, entry.content);
  }
};