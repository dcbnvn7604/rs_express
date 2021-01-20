import { validationResult } from 'express-validator';

import { User } from './model.js';
import { ValidationException } from '../exception.js';
import { UnauthenticateException } from './exception.js';
import generator from './token.js';

export async function authenticate(req, res, next) {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationException(errors.errors);
  }

  try {
    let user = await User.authenticate(req.body.username, req.body.password);
    let token = await generator.create({'username': user.username});
    res.json({token});
  } catch(e) {
    if (e instanceof UnauthenticateException) {
      res.status(400).json([{'msg': 'user not found'}]);
    } else {
      throw e;
    }
  }
}