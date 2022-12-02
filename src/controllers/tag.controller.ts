import { NextFunction, Request, Response, Router } from 'express';
import getTags from '../services/tag.service';
import { Authenticate } from '../utils/auth';
const router = Router();

router.get(
  '/tags',
  Authenticate,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const tags = await getTags(req.token['username']);
      res.json({ tags });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
