import { validationResult } from 'express-validator';

import { Entry } from './model.js';

export async function listEntry(req, res, next) {
  let entries = await Entry.search(req.query.q);
  res.render('list');
};

export function getCreateEntry(req, res, next) {
  res.render('create');
};

export async function postCreateEntry(req, res, next) {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('create');
    return;
  }
  await Entry.create(req.body.title, req.body.content, req.user);

  res.redirect('../list');
};