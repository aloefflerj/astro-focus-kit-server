import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('tasks')
export default class TasksController {
  @Get('')
  public getTasksForLoggedUser(_: Request, res: Response): void {
    res.send([
      {
        task: [
          {
            id: '123',
            title: 'surfar',
          },
        ],
      },
    ]);
  }
}
