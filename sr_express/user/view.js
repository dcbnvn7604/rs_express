import { validationResult } from 'express-validator';

import { User } from './model.js';
import { UnauthenticateException } from './exception.js';

export function getLogin(req, res, next) {
  res.render('login');
}

export async function postLogin(req, res, next) {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('login');
    return;
  }
  try {
    let user = await User.authenticate(req.body.username, req.body.password);
    req.session.username = user.username;
    res.redirect('../login');
  } catch(e) {
    if (e instanceof UnauthenticateException) {
      res.render('login');
    } else {
      throw e;
    }
  }
}

export async function getRegister(req, res, next) {
  res.render('register');
}

export async function postRegister(req, res, next) {
  let errors = validationResult(req);
  if (!errors.isEmpty() || (await User.exists(req.body.username))) {
    res.render('register');
    return
  }
  await User.create(req.body.username, req.body.password);
  res.redirect('../login');
}
