import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('tasks')
export class TasksController {
  @Get('')
  public getTasksForLoggedUser(_: Request, res: Response): void {
    res.send([
      {
        id: '1',
        order: 2,
        title: 'piano',
        type: 'binary',
        status: 'todo',
        urgent: false,
        important: false,
        description: null,
        registerDate: '2022/10/17',
        conclusionDate: null,
      },
      {
        id: '3',
        order: 3,
        title: 'painting',
        type: 'binary',
        status: 'todo',
        urgent: false,
        important: false,
        description: null,
        registerDate: '2022/10/18',
        conclusionDate: null,
      },
    ]);
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    res.status(201).send(req.body);
  }
}
