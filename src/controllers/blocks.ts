import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
  Post,
} from '@overnightjs/core';
import { defaultBlockedWebsites } from '@src/clients/defaultValues/defaultBlockedWebsites';
import { authMiddleware } from '@src/middlewares/auth';
import { restrictedOrigin } from '@src/middlewares/restrictedOrigin';
import { unrestrictedOrigin } from '@src/middlewares/unrestrictedOrigin';
import { Block, IBlock } from '@src/models/block';
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

  @Post('config')
  @Middleware(restrictedOrigin)
  public async newBlocksConfigForLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const blockService = new BlockService();

      const newBlocksConfig =
        await blockService.createsNewBlockConfigForLoggedUser(
          req.body as IBlock[],
          req.decoded?.id
        );

      res.status(StatusCodes.CREATED).send(newBlocksConfig);

      return;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        this.sendCreateUpdateErrorResponse(res, error);
        return;
      }
    }
    this.internalServerError(res);
  }

  @Get('config')
  @Middleware(restrictedOrigin)
  public async getBlocksConfigFromLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const blocks = await Block.find({ user: req.decoded?.id });

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
    }
    this.internalServerError(res);
  }

  @Get('')
  @Middleware(unrestrictedOrigin)
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
