import { Controller, Get, Middleware } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '.';

@Controller('ping')
export class PingController extends BaseController {
  constructor() {
    super();
  }

  @Get('')
  public async ping(_: Request, res: Response): Promise<void> {
    try {
      res.status(StatusCodes.OK).send();
      return;
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ code: StatusCodes.BAD_REQUEST, error: error.message });
        return;
      }

      this.internalServerError(res);
    }
  }

  @Get('auth')
  @Middleware(authMiddleware)
  public async pingAuth(_: Request, res: Response): Promise<void> {
    try {
      res.status(StatusCodes.OK).send();
      return;
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ code: StatusCodes.BAD_REQUEST, error: error.message });
        return;
      }

      this.internalServerError(res);
    }
  }
}
