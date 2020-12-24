import { Router } from 'express';

import { listEntry } from './view.js';
import { handleError } from '../util.js';
import { required_login } from '../user/util.js';

const router = new Router();

export default router;

router.get('/list', required_login, handleError(listEntry));