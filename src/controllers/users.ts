import { Controller, Post } from '@overnightjs/core';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { BaseController } from '.';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        this.sendCreateUpdateErrorResponse(res, error);
        return;
      }
      res.status(409).send({
        code: 409,
        error: 'User validation failed: name: Path `name` is required.',
      });
    }
  }

  @Post('auth')
  public async auth(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        code: StatusCodes.UNAUTHORIZED,
        error: 'User not found!',
      });
    }

    if (!(await AuthService.comparePasswords(password, user.password))) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        code: StatusCodes.UNAUTHORIZED,
        error: 'Password does not match!',
      });
    }
    const token = AuthService.generateToken(user.toJSON());
    return res.status(200).send({ ...user.toJSON(), ...{ token } });
  }
}
