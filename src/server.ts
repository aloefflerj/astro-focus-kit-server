import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import { TasksController } from './controllers/tasks';
import './util/module-alias';

export class SetupServer extends Server {
  constructor(private port = 3000 || process.env.port) {
    super();
  }

  public init(): void {
    this.setupExpress();
    this.setupControllers();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const taskControler = new TasksController();
    this.addControllers([taskControler]);
  }

  public getApp(): Application {
    return this.app;
  }
}
