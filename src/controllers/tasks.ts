import { Controller, Get, Post } from '@overnightjs/core';
import { Task } from '@src/models/task';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

@Controller('tasks')
export class TasksController {
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
        res.status(422).send({ code: 422, error: error.message });
      } else {
        res.status(500).send({ code: 500, error: 'Internal Server Error' });
      }
    }
  }
}
