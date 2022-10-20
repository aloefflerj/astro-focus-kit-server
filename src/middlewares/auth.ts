import AuthService from '@src/services/auth';
import { NextFunction, Request, Response } from 'express';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers['x-access-token'];
  // TODO: type token correctly
  const decoded = AuthService.decodeToken(token as string);
  req.decoded = decoded;
  next();
}
