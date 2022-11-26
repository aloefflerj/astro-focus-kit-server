import { Reason } from '@src/models/reasons';
import { User } from '@src/models/user';
import { StatusCodes } from 'http-status-codes';
import moment from 'moment-timezone';

describe('Reasons functional tests', () => {
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

    await Reason.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Reason.deleteMany({});
  });

  describe('When a given user answer why he wants to procrastinate', () => {
    it('it should save the reason', async () => {
      const { body: sitesBody } = await global.testRequest
        .get('/sites')
        .set({ 'x-access-token': token });

      const newReason = {
        content: 'Because I forgot what I was going to do',
        reasonDateTime: moment().toISOString(),
        site: sitesBody[0].id,
      };

      const { status, body } = await global.testRequest
        .post('/reasons')
        .set({ 'x-access-token': token })
        .send(newReason);

      expect(status).toBe(StatusCodes.CREATED);
      expect(body).toEqual(expect.objectContaining(newReason));
    });
  });

  describe('When fetching reasons from a give user', () => {
    it('should return reasons that he registered', async () => {
      const { body: sitesBody } = await global.testRequest
        .get('/sites')
        .set({ 'x-access-token': token });

      const newReason1 = {
        content: 'Because I forgot what I was going to do',
        reasonDateTime: moment().toISOString(),
        site: sitesBody[0].id,
      };

      const newReason2 = {
        content: 'Because it is raining',
        reasonDateTime: moment().toISOString(),
        site: sitesBody[0].id,
      };

      await global.testRequest
        .post('/reasons')
        .set({ 'x-access-token': token })
        .send(newReason1);

      await global.testRequest
        .post('/reasons')
        .set({ 'x-access-token': token })
        .send(newReason2);

      const { status, body } = await global.testRequest
        .get('/reasons')
        .set({ 'x-access-token': token });

      expect(status).toBe(StatusCodes.OK);
      expect(body).toEqual([
        expect.objectContaining(newReason1),
        expect.objectContaining(newReason2),
      ]);
    });
  });
});
