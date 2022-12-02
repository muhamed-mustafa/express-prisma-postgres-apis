import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { config } from 'dotenv';
config();

interface CustomRequest extends Request {
  token?: JwtPayload;
}

export const Authenticate = (
  req: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  const token = req.headers['x-auth-token'] as string;

  verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return response
        .status(401)
        .json({ message: 'Signup or Login to continue' });
    }

    req.token = decoded as JwtPayload;
    next();
  });
};
