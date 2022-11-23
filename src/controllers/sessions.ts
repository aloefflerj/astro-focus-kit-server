import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
  Patch,
} from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { unrestrictedOrigin } from '@src/middlewares/unrestrictedOrigin';
import { Session } from '@src/models/session';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { BaseController } from '.';

@Controller('sessions')
@ClassMiddleware(authMiddleware)
export class SessionsController extends BaseController {
  constructor() {
    super();
  }

  @Get('')
  @Middleware(unrestrictedOrigin)
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

  @Patch(':id')
  @Middleware(unrestrictedOrigin)
  public async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = <{ id: string }>req.params;
      const { status } = req.body;
      const response = await Session.findByIdAndUpdate(id, { status });

      if (!response) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ code: StatusCodes.NOT_FOUND, error: 'Session not found' });

        return;
      }

      res.status(StatusCodes.NO_CONTENT).send();
      return;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        this.sendCreateUpdateErrorResponse(res, error);
        return;
      }
    }
    this.internalServerError(res);
  }

  @Patch('')
  @Middleware(unrestrictedOrigin)
  public async updateStatusByUser(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.body;

      const response = await Session.findOneAndUpdate(
        { user: req.decoded?.id },
        { status }
      );

      if (!response) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ code: StatusCodes.NOT_FOUND, error: 'Session not found' });

        return;
      }

      res.status(StatusCodes.NO_CONTENT).send();
      return;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        this.sendCreateUpdateErrorResponse(res, error);
        return;
      }
    }
    this.internalServerError(res);
  }
}
