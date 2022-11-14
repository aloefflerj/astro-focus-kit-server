import { Controller, Get } from '@overnightjs/core';
import { ZenQuotes, ZenQuotesQuote } from '@src/clients/ZenQuotes';
import axios from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController } from '.';

@Controller('quotes')
export class QuotesController extends BaseController {
  client: ZenQuotes;

  constructor() {
    super();
    this.client = new ZenQuotes(axios);
  }

  @Get('')
  public async getQuote(req: Request, res: Response): Promise<void> {
    const quote = await this.client.fetchRandomQuote();
    res.status(StatusCodes.OK).send(quote[0]);
  }
}
