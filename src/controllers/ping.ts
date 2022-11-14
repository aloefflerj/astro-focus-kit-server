import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '.';

@Controller('ping')
export class PingController extends BaseController {
  constructor() {
    super();
  }

  @Get('')
  public async ping(req: Request, res: Response): Promise<void> {
    try {
      //   const user = req.decoded?.id;
      res.status(StatusCodes.OK).send();
      return;
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ code: StatusCodes.BAD_REQUEST, error: error.message });
        return;
      }

      this.internalServerError(res);
    }
  }
}
