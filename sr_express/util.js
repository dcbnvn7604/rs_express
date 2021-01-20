import { ValidationException } from './exception.js';

export var handleError = function(func) {
  return async function(req, res, next) {
    try {
      return await func(req, res, next);
    } catch (e) {
      next(e);
    }
  }
}

export var handleApiError = function(func) {
  return async function(req, res, next) {
    try {
      return await func(req, res, next);
    } catch (e) {
      if (e instanceof ValidationException) {
        res.status(400).json(e.errors);
        return
      }
      next(e);
    }
  }
}