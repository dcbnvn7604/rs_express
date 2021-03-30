import { validationResult } from 'express-validator';

import { Entry } from './model.js';

export const list = async (req, res, next) => {
  let entries = await Entry.search(req.query.q);
  res.json(entries);
}

export const create = async(req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.mapped());
  }

  await Entry.create(req.body.title, req.body.content, req.user);
  res.status(201).end();
}