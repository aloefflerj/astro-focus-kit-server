import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { ZenQuotes } from '@src/clients/ZenQuotes';
import { restrictedOrigin } from '@src/middlewares/restrictedOrigin';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '.';

@Controller('quotes')
@ClassMiddleware(restrictedOrigin)
export class QuotesController extends BaseController {
  client: ZenQuotes;

  constructor() {
    super();
    this.client = new ZenQuotes();
  }

  @Get('')
  public async getQuote(req: Request, res: Response): Promise<void> {
    const quote = await this.client.fetchRandomQuote();
    res.status(StatusCodes.OK).send(quote);
  }
}
