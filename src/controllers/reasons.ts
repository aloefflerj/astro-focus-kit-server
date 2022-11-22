import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { restrictedOrigin } from '@src/middlewares/restrictedOrigin';
import { Reason } from '@src/models/reasons';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { BaseController } from '.';

@Controller('reasons')
@ClassMiddleware(authMiddleware)
@ClassMiddleware(restrictedOrigin)
export class ReasonsController extends BaseController {
  constructor() {
    super();
  }

  @Post('')
  public async newReason(req: Request, res: Response): Promise<void> {
    try {
      const block = new Reason({ ...req.body, user: req.decoded?.id });
      const result = await block.save();
      res.status(StatusCodes.CREATED).send(result);
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
