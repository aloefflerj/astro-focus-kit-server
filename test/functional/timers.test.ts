import { defaultTimerValue } from '@src/clients/defaultValues/defaultTimerValue';
import { Timer } from '@src/models/timer';
import { User } from '@src/models/user';
import { StatusCodes } from 'http-status-codes';
import moment from 'moment-timezone';

describe('Timers functional tests', () => {
  const defaultUser = {
    name: 'dovahkiin',
    email: 'dovahkiin@skyrim.com',
    password: '12345',
  };

  let token: string;

  beforeEach(async () => {
    await global.testRequest.post('/users').send(defaultUser);
    const { body: userBody } = await global.testRequest
      .post('/users/auth')
      .send({ email: defaultUser.email, password: defaultUser.password });
    token = userBody.token;

    await Timer.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Timer.deleteMany({});
  });

  describe('When fetching timer config from a given user', () => {
    it.only('should return default timer config if it had not been configured yet', async () => {
      await global.testRequest.post('/users').send(defaultUser);

      const { body: userBody } = await global.testRequest
        .post('/users/auth')
        .send({ email: defaultUser.email, password: defaultUser.password });

      const { status, body } = await global.testRequest
        .get('/timers')
        .set({ 'x-access-token': userBody.token });

      expect(status).toBe(StatusCodes.OK);
      expect(body).toEqual(
        expect.objectContaining({ time: defaultTimerValue })
      );
    });
  });
});
