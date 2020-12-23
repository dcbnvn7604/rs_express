export var handleError = function(func) {
  return async function(req, res, next) {
    try {
      return await func(req, res, next);
    } catch (e) {
      next(e);
    }
  }
}