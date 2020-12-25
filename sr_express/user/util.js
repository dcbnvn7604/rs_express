import { User } from './model.js';

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