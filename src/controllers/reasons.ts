import { ClassMiddleware, Controller, Get, Post } from '@overnightjs/core';
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

  @Get('')
  public async getReasonsFromLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const reason = await Reason.find({
        user: req.decoded?.id,
      });
      res.status(StatusCodes.OK).send(reason);
      return;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ code: StatusCodes.BAD_REQUEST, error: error.message });
        return;
      }

      this.internalServerError(res);
    }
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
