import './util/moduleAlias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import TasksController from './controllers/tasks';
// import app from './app';

// const port = process.env.port || 3000;

// app.listen(port);

export default class SetupServer extends Server {
  constructor(private port = process.env.port || 3000) {
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
    const tasksController = new TasksController();
    this.addControllers([tasksController]);
  }
}
