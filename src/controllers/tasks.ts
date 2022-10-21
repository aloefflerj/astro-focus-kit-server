import { ClassMiddleware, Controller, Get, Post } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { Task } from '@src/models/task';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { BaseController } from '.';

@Controller('tasks')
@ClassMiddleware(authMiddleware)
export class TasksController extends BaseController {
  @Get('')
  public async getTasksForLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const tasks = await Task.find({ user: req.decoded?.id });
      res.status(StatusCodes.OK).send(tasks);
      return;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ code: StatusCodes.BAD_REQUEST, error: error.message });
        return;
      }

      this.internalServerError(res);
    }
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const task = new Task({ ...req.body, user: req.decoded?.id });
      const result = await task.save();
      res.status(StatusCodes.CREATED).send(result);
      return;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        this.sendCreateUpdateErrorResponse(res, error);
        return;
      }
    }
    this.internalServerError(res);
  }
}
