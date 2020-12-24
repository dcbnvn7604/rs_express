export var generateData = function(sample, exclude=[], update={}) {
  let data = {};
  for (let key in sample) {
    if (exclude.includes(key)) {
      continue;
    }

    if (key in update) {
      data[key] = update[key];
    } else {
      data[key] = sample[key]
    }
  }
  return data;
}

export var sendData = function(request, data) {
  let _request = request;
  for (let key in data) {
    _request = _request.send(`${key}=${data[key]}`);
  }
  return _request
};

export var setLogin = function(user) {
  return async function(req, res, next) {
    req.session.username = user.username;
    next();
  };
}