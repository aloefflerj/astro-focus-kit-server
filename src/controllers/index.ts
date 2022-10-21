import { CUSTOM_VALIDATION } from '@src/models/user';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(
    res: Response,
    error: mongoose.Error.ValidationError | Error
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);
      res.status(clientErrors.code).send(clientErrors);
      return;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
    });
  }

  private handleClientErrors(error: mongoose.Error.ValidationError): {
    code: number;
    error: string;
  } {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
    );

    if (!duplicatedKindErrors.length) {
      return {
        code: StatusCodes.UNPROCESSABLE_ENTITY,
        error: error.message,
      };
    }

    return { code: StatusCodes.CONFLICT, error: error.message };
  }

  protected internalServerError(res: Response): void {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
    });
  }
}
