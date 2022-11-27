import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
  Patch,
} from '@overnightjs/core';
import { defaultTimerValue } from '@src/clients/defaultValues/defaultTimerValue';
import { authMiddleware } from '@src/middlewares/auth';
import { restrictedOrigin } from '@src/middlewares/restrictedOrigin';
import { unrestrictedOrigin } from '@src/middlewares/unrestrictedOrigin';
import { Timer } from '@src/models/timer';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { BaseController } from '.';

@Controller('timers')
@ClassMiddleware(authMiddleware)
export class TimersController extends BaseController {
  constructor() {
    super();
  }

  @Get('')
  @Middleware(restrictedOrigin)
  public async getTimerConfigFromLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const timer = await Timer.findOne({ user: req.decoded?.id });

      res.status(StatusCodes.OK).send(timer);
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
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = <{ id: string }>req.params;

      const response = await Timer.findByIdAndUpdate(id, req.body);

      if (!response) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ code: StatusCodes.NOT_FOUND, error: 'Timer not found' });

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
