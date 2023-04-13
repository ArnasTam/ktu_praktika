import { NextFunction, Response } from 'express';
import * as fs from 'fs';
import { verify } from 'jsonwebtoken';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser } from '@interfaces/auth.interface';

// TODO:
const cert = fs.readFileSync('src/certs/auth0.crt');

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;

    if (token) {
      await verify(token, cert, { algorithms: ['RS256'] });
      next();
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, error));
  }
};

export default authMiddleware;
