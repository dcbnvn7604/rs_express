import { Router } from 'express';

import { listEntry, getCreateEntry,  postCreateEntry, getUpdateEntry, postUpdateEntry, postDeleteEntry } from './view.js';
import { handleError } from '../util.js';
import { requiredLogin, hasPermissions, requiredToken } from '../user/util.js';
import { create } from './validator.js';
import { list as apiList, create as apiCreate, update as apiUpdate, _delete as apiDelete } from './api.js';

export const web = new Router();

web.get('/list', requiredLogin, handleError(listEntry));
web.get('/create', [requiredLogin, hasPermissions(['entry.create'])], getCreateEntry);
web.post('/create', [requiredLogin, hasPermissions(['entry.create']), create], handleError(postCreateEntry));
web.get('/:id/update', [requiredLogin, hasPermissions(['entry.update'])], handleError(getUpdateEntry));
web.post('/:id/update', [requiredLogin, hasPermissions(['entry.update']), create], handleError(postUpdateEntry));
web.post('/:id/delete', [requiredLogin, hasPermissions(['entry.delete'])], handleError(postDeleteEntry));

export const api = new Router();

api.get('', requiredToken, apiList);
api.post('', [requiredToken, hasPermissions(['entry.create']), create], apiCreate);
api.post('/:id', [requiredToken, hasPermissions(['entry.update']), create], apiUpdate);
api.delete('/:id', [requiredToken, hasPermissions(['entry.delete'])], apiDelete);