import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { defaultWebsitesToBlock } from '@src/clients/defaultValues/defaultWebsitesToBlock';
import { defaultTimerValue } from '@src/clients/defaultValues/defaultTimerValue';
import { restrictedOrigin } from '@src/middlewares/restrictedOrigin';
import { Session } from '@src/models/session';
import { Site } from '@src/models/site';
import { Timer } from '@src/models/timer';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { BaseController } from '.';

@Controller('users')
@ClassMiddleware(restrictedOrigin)
export class UsersController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();

      const sitesConfig = defaultWebsitesToBlock.map(({ url }) => {
        return { url, user: newUser.id };
      });

      await Site.insertMany(sitesConfig);

      const session = new Session({ status: 'focusing', user: newUser.id });
      await session.save();

      const timers = new Timer({ time: defaultTimerValue, user: newUser.id });
      await timers.save();

      res.status(StatusCodes.CREATED).send(newUser);
      return;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        this.sendCreateUpdateErrorResponse(res, error);
        return;
      }
      res.status(StatusCodes.CONFLICT).send({
        code: StatusCodes.CONFLICT,
        error: 'User validation failed: name: Path `name` is required.',
      });
    }
    this.internalServerError(res);
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
    return res.status(StatusCodes.OK).send({ ...user.toJSON(), ...{ token } });
  }
}
