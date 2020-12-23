import { checkSchema } from 'express-validator';

export const login = checkSchema({
  username: {
    in: 'body',
    exists: true
  },
  password: {
    in: 'body',
    exists: true
  }
});

export const register = checkSchema({
  username: {
    in: 'body',
    exists: true
  },
  password: {
    in: 'body',
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