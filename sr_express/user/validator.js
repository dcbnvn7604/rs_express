import { checkSchema } from 'express-validator';
export var register = checkSchema({
  username: {
    in: ['body'],
    exists: true
  },
  password: {
    in: ['body'],
    exists: true,
  },
  repassword: {
    custom: {
      options: (value, {req}) => {
        if (value != req.body.password) {
          return false;
        }
        return true;
      }
    }
  }
});