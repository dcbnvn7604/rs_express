import { Entry } from './model.js';

export async function listEntry(req, res, next) {
  let entries = await Entry.search(req.query.q);
  res.render('list');
};