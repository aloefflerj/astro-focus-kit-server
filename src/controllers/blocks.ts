import { ClassMiddleware, Controller, Get, Post } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { unrestrictedOrigin } from '@src/middlewares/unrestrictedOrigin';
import { Block } from '@src/models/blocks';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { BaseController } from '.';

@Controller('blocks')
@ClassMiddleware(authMiddleware)
@ClassMiddleware(unrestrictedOrigin)
export class BlocksController extends BaseController {
  constructor() {
    super();
  }

  @Post('')
  public async newBlock(req: Request, res: Response): Promise<void> {
    try {
      const block = new Block({ ...req.body, user: req.decoded?.id });
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

  @Get('last')
  public async getLastBlockByUser(req: Request, res: Response): Promise<void> {
    try {
      const block = await Block.findOne(
        { user: req.decoded?.id },
        {},
        { sort: { blockDateTime: -1 } }
      );

      res.status(StatusCodes.OK).send(block);
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
