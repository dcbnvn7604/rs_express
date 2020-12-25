import { Router } from 'express';

import { getLogin, postLogin, postLogout, getRegister, postRegister } from './view.js';
import { register, login } from './validator.js';
import { handleError } from '../util.js';
import { requiredLogin } from './util.js';

const router = Router();

export default router

router.get('/login', getLogin);
router.post('/login', login, handleError(postLogin));
router.post('/logout', requiredLogin, postLogout);
router.get('/register', getRegister);
router.post('/register', register, handleError(postRegister));
