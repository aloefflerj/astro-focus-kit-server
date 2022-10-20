import { CUSTOM_VALIDATION } from '@src/models/user';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

export abstract class BaseController {
  protected sendCreatedUpdateErrorResponse(
    res: Response,
    error: mongoose.Error.ValidationError | Error
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const duplicatedKindErrors = Object.values(error.errors).filter(
        (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
      );

      if (duplicatedKindErrors.length) {
        res
          .status(StatusCodes.CONFLICT)
          .send({ code: StatusCodes.CONFLICT, error: error.message });
      } else {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
          code: StatusCodes.UNPROCESSABLE_ENTITY,
          error: error.message,
        });
      }
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
      });
    }
  }
}
