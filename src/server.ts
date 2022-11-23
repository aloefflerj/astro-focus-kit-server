import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import cors from 'cors';
import * as database from '@src/database';
import * as moment from 'moment-timezone';
import 'moment/locale/pt-br';

import { TasksController } from './controllers/tasks';
import { UsersController } from './controllers/users';
import { QuotesController } from './controllers/quote';
import { PingController } from './controllers/ping';
import { SitesController } from './controllers/sites';
import { BlocksController } from './controllers/blocks';
import { ReasonsController } from './controllers/reasons';
import { SessionsController } from './controllers/sessions';

export class SetupServer extends Server {
  constructor(private port = 8614 || process.env.port) {
    super();
  }

  public async init(): Promise<void> {
    this.setupLocale();
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());

    this.app.use(
      cors({
        origin: '*',
      })
    );
  }

  private setupControllers(): void {
    const tasksController = new TasksController();
    const usersController = new UsersController();
    const quotesController = new QuotesController();
    const pingController = new PingController();
    const sitesController = new SitesController();
    const blocksController = new BlocksController();
    const reasonsController = new ReasonsController();
    const sessionsController = new SessionsController();

    this.addControllers([
      tasksController,
      usersController,
      quotesController,
      pingController,
      sitesController,
      blocksController,
      reasonsController,
      sessionsController,
    ]);
  }

  private setupLocale(): void {
    moment.tz.setDefault('America/Sao_Paulo');
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.app.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.info('Server listening on port', this.port);
    });
  }
}
