import {
  ClassMiddleware,
  Controller,
  Get,
  Patch,
  Post,
} from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { Task } from '@src/models/task';
import TasksService from '@src/services/tasks';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { BaseController } from '.';

interface ReorderRequestBody {
  order: number;
  destinationDate: string;
}

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

  @Patch('reorder/:id')
  public async reorder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = <{ id: string }>req.params;
      const { order, destinationDate } = <ReorderRequestBody>req.body;

      const tasksService = new TasksService();
      const reorderedTasks = await tasksService.reorderTasks(
        id,
        order,
        destinationDate,
        req.decoded?.id
      );

      res.status(StatusCodes.OK).send(reorderedTasks);
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
