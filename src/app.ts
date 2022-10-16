import express from 'express';
import cors from 'cors';
import dbConfig from './config/db';

class App {
  public express: express.Application;

  public constructor() {
    this.express = express();
    this.middlewares();
    App.database();
    this.routes();
  }

  private middlewares(): void {
    this.express.use(express.json());
    this.express.use(cors());
  }

  private static database(): void {
    dbConfig();
  }

  private routes(): void {
    this.express.get('/', (req, res) => {
      return res.send('Hello World');
    });

    this.express.get('/tasks', (req, res) => {
      return res.json([
        {
          task: [
            {
              id: '123',
              title: 'surfar',
            },
          ],
        },
      ]);
    });
  }
}

export default new App().express;
