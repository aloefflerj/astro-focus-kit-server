import { NextFunction, Request, Response } from 'express';

export function unrestrictedOrigin(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void {
  const origin = req.headers?.origin;

  res.set?.({
    'access-control-allow-origin': origin,
  });

  next();
}
