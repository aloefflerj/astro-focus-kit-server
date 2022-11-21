import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
} from '@overnightjs/core';
import { defaultBlockedWebsites } from '@src/clients/defaultValues/defaultBlockedWebsites';
import { authMiddleware } from '@src/middlewares/auth';
import { blockedSitesOrigin } from '@src/middlewares/blockedSitesOrigin';
import BlockService from '@src/services/block';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { BaseController } from '.';

@Controller('blocks')
@ClassMiddleware(authMiddleware)
export class BlocksController extends BaseController {
  constructor() {
    super();
  }

  @Get('')
  @Middleware(blockedSitesOrigin)
  public async getBlocksFromLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const blockService = new BlockService();
      const userId = req.decoded?.id;

      if (!userId) {
        this.internalServerError(res);
        return;
      }

      if (!(await blockService.hasAnyTaskForTheDay(userId))) {
        res.status(StatusCodes.OK).send([]);
        return;
      }

      const blocks = await blockService.getBlocksFromLoggedUser(userId);

      if (blocks.length === 0) {
        res.status(StatusCodes.OK).send(defaultBlockedWebsites);
        return;
      }

      res.status(StatusCodes.OK).send(blocks);

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
}
