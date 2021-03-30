import { validationResult } from 'express-validator';

import { Entry } from './model.js';
import { NotFoundException } from '../exception.js';

export const list = async (req, res, next) => {
  let entries = await Entry.search(req.query.q);
  res.json(entries);
}

export const create = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.mapped());
  }

  await Entry.create(req.body.title, req.body.content, req.user);
  res.status(201).end();
}

export const update = async (req, res, next) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json(errors.mapped());
  }

  try {
    let entry = await Entry.byId(req.params.id);
    await entry.update(req.body.title, req.body.content);
  } catch(e) {
    if (e instanceof NotFoundException) {
      res.status(404).end();
      return;
    }
    throw e;
  }
  res.status(200).end();
}

export const _delete = async(req, res, next) => {
  try {
    let entry = await Entry.byId(req.params.id);
    await entry.delete();
  } catch(e) {
    if (e instanceof NotFoundException) {
      res.status(404).end();
      return;
    }
    throw e;
  }
  res.status(200).end();
}
