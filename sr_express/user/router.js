import { Router } from 'express';

import { getLogin, postLogin, postLogout, getRegister, postRegister } from './view.js';
import { register, login } from './validator.js';
import { handleError, handleApiError } from '../util.js';
import { requiredLogin } from './util.js';
import { authenticate } from './api.js';

export const web = Router();

web.get('/login', getLogin);
web.post('/login', login, handleError(postLogin));
web.post('/logout', requiredLogin, postLogout);
web.get('/register', getRegister);
web.post('/register', register, handleError(postRegister));

export const api = Router();

api.post('/authenticate', login, handleApiError(authenticate));
