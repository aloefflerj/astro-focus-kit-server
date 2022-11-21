import { NextFunction, Request, Response } from 'express';
import config, { IConfig } from 'config';

export function origin(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void {
  const domains: IConfig = config.get('App.domains');
  const webclient = domains.get<string>('webclient');

  res.set?.({
    'access-control-allow-origin': webclient,
  });

  next();
}
