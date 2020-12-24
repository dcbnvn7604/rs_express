export var required_login = async function(req, res, next) {  
  if (!req.session.username) {
    res.redirect('/user/login');
  } else {
    next();
  }
};