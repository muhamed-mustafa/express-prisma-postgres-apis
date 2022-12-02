import { Router } from 'express';
import authController from '../controllers/authController';
import articeController from '../controllers/articleController';
import profileController from '../controllers/profileController';
import tagController from '../controllers/tag.controller';

const api = Router()
  .use(authController)
  .use(articeController)
  .use(profileController)
  .use(tagController);

export default Router().use('/api', api);
