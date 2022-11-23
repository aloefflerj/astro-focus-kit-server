import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { restrictedOrigin } from '@src/middlewares/restrictedOrigin';
import { Session } from '@src/models/session';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { BaseController } from '.';

@Controller('session')
@ClassMiddleware(authMiddleware)
@ClassMiddleware(restrictedOrigin)
export class SessionsController extends BaseController {
  constructor() {
    super();
  }

  @Get('')
  public async getUserSession(req: Request, res: Response): Promise<void> {
    try {
      const result = await Session.find({ user: req.decoded?.id });
      res.status(StatusCodes.CREATED).send(result[0]);
      return;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ code: StatusCodes.BAD_REQUEST, error: error.message });
        return;
      }
    }
    this.internalServerError(res);
  }
}
