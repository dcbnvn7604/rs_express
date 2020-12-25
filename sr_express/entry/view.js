import { validationResult } from 'express-validator';

import { Entry } from './model.js';
import { NotFoundException } from '../exception.js';

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

export async function getUpdateEntry(req, res, next) {
  try {
    let entry = await Entry.byId(req.params.id);
  } catch(e) {
    if (e instanceof NotFoundException) {
      res.status(404).end();
      return;
    }
    throw e;
  }
  res.render('create');
}

export async function postUpdateEntry(req, res, next) {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('create');
    return;
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
  res.redirect('../list');
}

export async function postDeleteEntry(req, res, next) {
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
  res.redirect('../list');
};