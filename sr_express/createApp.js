import express from 'express';
import session from 'express-session';

import db from './db.js';
import userRouter from './user/router.js';
import entryRouter from './entry/router.js';

export default function createApp(middlewares=[]) {
  const app = express();

  db.init(process.env.MONGO_HOST, process.env.MONGO_DATABASE, process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD);

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

  middlewares.forEach(middleware => {
    app.use(middleware);
  });

  app.use('/user', userRouter);
  app.use('/entry', entryRouter);


  return app;
}
