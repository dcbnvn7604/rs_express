import { JOSEError } from 'jose/util/errors';

import { User } from './model.js';
import { UnauthenticateException } from './exception.js';
import generator from './token.js';

export var requiredLogin = async function(req, res, next) {
  if (!req.session.username) {
    res.redirect('/user/login');
  } else {
    req.user = await User.byUsername(req.session.username);
    next();
  }
};

export var hasPermissions = function(permissions) {
  return function(req, res, next) {
    if (!req.user || !req.user.hasPermissions(permissions)) {
      res.status(403).send();
    } else {
      next();
    }
  }
}

export const requiredToken = async function(req, res, next) {
  try {
    if (!req.get('Authorization')) {
      throw new UnauthenticateException();
    }
    let parts = req.get('Authorization').split(" ");

    if (parts[0] != 'Bearer') {
      throw new UnauthenticateException();
    }
    let payload = await generator.verify(parts[1]);
    req.user = await User.byUsername(payload.username);
    next();
  } catch(e) {
    if (e instanceof UnauthenticateException || (e instanceof JOSEError && e.code == 'ERR_JWE_INVALID')) {
      res.status(401).send();
      return;
    }
    next(e);
  }
}