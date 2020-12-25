import { Router } from 'express';

import { listEntry, getCreateEntry,  postCreateEntry, getUpdateEntry, postUpdateEntry, postDeleteEntry } from './view.js';
import { handleError } from '../util.js';
import { requiredLogin, hasPermissions } from '../user/util.js';
import { create } from './validator.js';

const router = new Router();

export default router;

router.get('/list', requiredLogin, handleError(listEntry));
router.get('/create', [requiredLogin, hasPermissions(['entry.create'])], getCreateEntry);
router.post('/create', [requiredLogin, hasPermissions(['entry.create']), create], handleError(postCreateEntry));
router.get('/:id/update', [requiredLogin, hasPermissions(['entry.update'])], handleError(getUpdateEntry));
router.post('/:id/update', [requiredLogin, hasPermissions(['entry.update']), create], handleError(postUpdateEntry));
router.post('/:id/delete', [requiredLogin, hasPermissions(['entry.delete'])], handleError(postDeleteEntry));