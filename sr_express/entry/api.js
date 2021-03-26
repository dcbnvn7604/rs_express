import { Entry } from './model.js';

export const list = async (req, res, next) => {
  let entries = await Entry.search(req.query.q);
  res.json(entries);
}