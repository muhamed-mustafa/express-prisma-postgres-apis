import { Router, Response, NextFunction } from 'express';
import {
  getProfile,
  followUser,
  unFollowUser,
  allUsers,
} from '../services/profile.service';
import { getCurrentUser } from '../services/auth.service';
import { Authenticate } from '../utils/auth';
const router = Router();

router.get(
  '/all-users',
  Authenticate,
  async (req: any, res: Response, next: NextFunction) => {
    let users = await allUsers();
    res.status(200).send({ status: 200, users, success: true });
  }
);

router.get(
  '/profile',
  Authenticate,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = await getCurrentUser(req.token['username']);

      const profile = await getProfile(user!.username);

      res.status(200).send({ status: 200, profile, success: true });
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  '/followUser/:usernamePayload',
  Authenticate,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = await getCurrentUser(req.token['username']);

      await followUser(req.params.usernamePayload, user.username);

      res
        .status(200)
        .send({ status: 200, msg: 'Followd Successfully', success: true });
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  '/unfollowUser/:usernamePayload',
  Authenticate,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = await getCurrentUser(req.token['username']);

      await unFollowUser(req.params.usernamePayload, user.username);

      res
        .status(200)
        .send({ status: 200, msg: 'unFollowd Successfully', success: true });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
