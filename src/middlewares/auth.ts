import AuthService from '@src/services/auth';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function authMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void {
  const token = req.headers?.['x-access-token'];
  try {
    // TODO: type token correctly
    const decoded = AuthService.decodeToken(token as string);
    req.decoded = decoded;
  } catch (error) {
    if (!(error instanceof Error)) return;

    res
      .status?.(StatusCodes.UNAUTHORIZED)
      .send({ code: StatusCodes.UNAUTHORIZED, error: error.message });
  }
  next();
}
