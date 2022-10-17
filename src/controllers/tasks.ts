import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('tasks')
export class TasksController {
  @Get('')
  public getTasksForLoggedUser(_: Request, res: Response): void {
    res.send([
      {
        id: '12345',
        task: 'study',
      },
      {
        id: '678910',
        task: 'read',
      },
    ]);
  }
}
