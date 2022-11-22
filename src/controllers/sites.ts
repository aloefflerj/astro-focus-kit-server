import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
  Post,
} from '@overnightjs/core';
import { defaultWebsitesToBlock } from '@src/clients/defaultValues/defaultWebsitesToBlock';
import { authMiddleware } from '@src/middlewares/auth';
import { restrictedOrigin } from '@src/middlewares/restrictedOrigin';
import { unrestrictedOrigin } from '@src/middlewares/unrestrictedOrigin';
import { Site, ISite } from '@src/models/site';
import SiteService from '@src/services/site';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { BaseController } from '.';

@Controller('sites')
@ClassMiddleware(authMiddleware)
export class SitesController extends BaseController {
  constructor() {
    super();
  }

  @Post('config')
  @Middleware(restrictedOrigin)
  public async newSitesConfigForLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const siteService = new SiteService();

      const newSitesConfig =
        await siteService.createsNewSiteConfigForLoggedUser(
          req.body as ISite[],
          req.decoded?.id
        );

      res.status(StatusCodes.CREATED).send(newSitesConfig);

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
  public async getSitesConfigFromLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const sites = await Site.find({ user: req.decoded?.id });

      res.status(StatusCodes.OK).send(sites);
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
  public async getSitesFromLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const siteService = new SiteService();
      const userId = req.decoded?.id;

      if (!userId) {
        this.internalServerError(res);
        return;
      }

      if (!(await siteService.hasAnyTaskForTheDay(userId))) {
        res.status(StatusCodes.OK).send([]);
        return;
      }

      const sites = await siteService.getSitesFromLoggedUser(userId);

      if (sites.length === 0) {
        res.status(StatusCodes.OK).send(defaultWebsitesToBlock);
        return;
      }

      res.status(StatusCodes.OK).send(sites);

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
