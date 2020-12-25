import { checkSchema } from 'express-validator';

export const create = checkSchema({
  title: {
    in: 'body',
    exists: true
  },
  content: {
    in: 'body',
    exists: true
  }
});