import { Router } from 'express';

import { getLogin, getRegister, postRegister } from './view.js';
import { register } from './validator.js';
import { handleError } from '../util.js';

const router = Router();

export default router

router.get('/login', getLogin);
router.get('/register', getRegister);
router.post('/register', register, handleError(postRegister));
