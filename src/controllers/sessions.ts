import { ClassMiddleware, Controller, Get, Patch } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { restrictedOrigin } from '@src/middlewares/restrictedOrigin';
import { Session } from '@src/models/session';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { BaseController } from '.';

@Controller('sessions')
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

  @Patch(':id')
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
