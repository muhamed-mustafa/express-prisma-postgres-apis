import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import HttpException from './utils/http-exception';
import routes from './routes/routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use(
  (
    err: Error | HttpException,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    // @ts-ignore
    if (err && err.errorCode) {
      // @ts-ignore
      res.status(err.errorCode).json(err.message);
    } else {
      res.status(500).json({ error: err.message });
    }
  }
);

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
