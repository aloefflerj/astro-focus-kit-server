import {
  ClassMiddleware,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
} from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { restrictedOrigin } from '@src/middlewares/restrictedOrigin';
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
@ClassMiddleware(restrictedOrigin)
export class TasksController extends BaseController {
  service: TasksService;

  constructor() {
    super();
    this.service = new TasksService();
  }

  @Get('')
  public async getTasksFromLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const tasks = await Task.find({ user: req.decoded?.id, deleted: false });
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

  @Delete(':id')
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = <{ id: string }>req.params;
      //TODO: adds code 410 GONE if it has already been deleted
      const response = await Task.findByIdAndUpdate(
        id,
        { deleted: true },
        { new: true }
      );
      if (!response) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ code: StatusCodes.NOT_FOUND, error: 'Task not found' });
        return;
      }
      if (response.deleted !== true) {
        res.status(StatusCodes.BAD_REQUEST).send({
          code: StatusCodes.BAD_REQUEST,
          error: 'Task could not be deleted',
        });
        return;
      }
      res.status(StatusCodes.NO_CONTENT).send();
      return;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          error: error.message,
        });
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        error: (error as Error).message,
      });
      return;
    }
  }

  @Patch('reorder/:id')
  public async reorder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = <{ id: string }>req.params;
      const { order, destinationDate } = <ReorderRequestBody>req.body;

      const reorderedTasks = await this.service.reorderTasks(
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

  @Put(':id')
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = <{ id: string }>req.params;
      const response = await Task.findByIdAndUpdate(id, req.body);

      if (!response) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ code: StatusCodes.NOT_FOUND, error: 'Task not found' });

        return;
      }

      res.status(StatusCodes.NO_CONTENT).send();
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
