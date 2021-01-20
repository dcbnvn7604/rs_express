import express from 'express';
import session from 'express-session';

import db from './db.js';
import generator from './user/token.js';
import { web as webUserRouter, api as apiUserRouter } from './user/router.js';
import entryRouter from './entry/router.js';

export default function createApp(middlewares=[]) {
  const app = express();

  db.init(process.env.MONGO_HOST, process.env.MONGO_DATABASE, process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD);
  generator.init(process.env.SR_SECRET);

  app.set('view engine', 'hbs');
  app.set('views', [
    process.cwd() + '/sr_express/user/templates',
    process.cwd() + '/sr_express/entry/templates',
  ])

  app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SR_SECRET
  }));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  middlewares.forEach(middleware => {
    app.use(middleware);
  });

  app.use('/user', webUserRouter);
  app.use('/entry', entryRouter);

  app.use('/api/user', apiUserRouter);

  return app;
}
