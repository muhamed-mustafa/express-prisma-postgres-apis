import { Router, Request, Response, NextFunction } from 'express';
import {
  createArticle,
  getOneArticle,
  addComment,
  deleteComment,
  updateComment,
  favArticle,
  unFavArticle,
} from '../services/article.service';
import { getCurrentUser } from '../services/auth.service';
import { Authenticate } from '../utils/auth';
import HttpException from '../utils/http-exception';
const router = Router();

router.post(
  '/articles',
  Authenticate,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = await getCurrentUser(req.token['username']);

      const article = await createArticle(req.body, user.username);

      res.json({ article });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  '/articles/:slug',
  Authenticate,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = await getCurrentUser(req.token['username']);

      const article = await getOneArticle(req.params.slug, user!.username);

      res.json({ article });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/articles/:slug/comments',
  Authenticate,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = await getCurrentUser(req.token['username']);

      const comment = await addComment(
        req.body.body,
        req.params.slug,
        user!.username
      );

      res.json({ comment });
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  '/articles/comments/:id',
  Authenticate,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = await getCurrentUser(req.token['username']);

      const comment = await deleteComment(+req.params.id, user!.username);

      res.json({ message: 'Comment deleted successfully' });
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  '/articles/comments/:id',
  Authenticate,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { body } = req.body;
      if (!body) {
        throw new HttpException(400, 'Invalid body received');
      }

      const user = await getCurrentUser(req.token['username']);

      const comment = await updateComment(body, +req.params.id, user!.username);

      res.json({ message: 'Comment Updated successfully', comment });
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  '/articles/:slug/favorite',
  Authenticate,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = await getCurrentUser(req.token['username']);

      const favorite = await favArticle(req.params.slug, user!.username);

      res.json({ message: 'fav successfully', favorite });
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  '/articles/:slug/unfavorite',
  Authenticate,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = await getCurrentUser(req.token['username']);

      const favorite = await unFavArticle(req.params.slug, user!.username);

      res.json({ message: 'unsfav successfully', favorite });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
