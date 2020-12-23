import db from '../sr_express/db.js';

export const mochaGlobalTeardown = async () => {
  await db.close();
};