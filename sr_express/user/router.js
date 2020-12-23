import { Router } from 'express';

import { getLogin, postLogin, getRegister, postRegister } from './view.js';
import { register, login } from './validator.js';
import { handleError } from '../util.js';

const router = Router();

export default router

router.get('/login', getLogin);
router.post('/login', login, handleError(postLogin));
router.get('/register', getRegister);
router.post('/register', register, handleError(postRegister));
