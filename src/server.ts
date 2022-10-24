import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import { TasksController } from './controllers/tasks';
import cors from 'cors';
import * as database from '@src/database';
import { UsersController } from './controllers/users';
import * as moment from 'moment';
import 'moment/locale/pt-br';

export class SetupServer extends Server {
  constructor(private port = 3000 || process.env.port) {
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
    this.addControllers([tasksController, usersController]);
  }

  private setupLocale(): void {
    moment.locale('pt-br');
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
