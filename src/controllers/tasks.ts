import { Controller, Get, Post } from '@overnightjs/core';
import { Task } from '@src/models/task';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BaseController } from '.';

@Controller('tasks')
export class TasksController extends BaseController {
  @Get('')
  public async getTasksForLoggedUser(_: Request, res: Response): Promise<void> {
    try {
      const tasks = await Task.find({});
      res.status(200).send(tasks);
    } catch (error) {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const task = new Task(req.body);
      const result = await task.save();
      res.status(201).send(result);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        this.sendCreatedUpdateErrorResponse(res, error);
      }
    }
  }
}
