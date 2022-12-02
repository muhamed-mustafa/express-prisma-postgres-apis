import { Router, Request, Response, NextFunction } from 'express';
import {
  createUser,
  getCurrentUser,
  login,
  deleteUser,
  updateUser,
} from '../services/auth.service';
import { Authenticate } from '../utils/auth';
const router = Router();

router.post(
  '/users',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await createUser(req.body);
      console.log(user.email);

      res.json(user);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/users/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await login(req.body);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/user',
  Authenticate,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = await getCurrentUser(req.token['username']);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/update-user',
  Authenticate,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      let user = await getCurrentUser(req.token['username']);
      let updatedUser = await updateUser(req.body, user.username);
      res.json({ updatedUser });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/user/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await deleteUser(+req.params.id);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
