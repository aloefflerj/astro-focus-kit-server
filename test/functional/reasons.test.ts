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
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  describe('When a given user answer why he wants to procrastinate', () => {
    it('it should save the reason', async () => {
      const { body: sitesBody } = await global.testRequest
        .get('/sites/config')
        .set({ 'x-access-token': token });

      const newReason = {
        content: 'Because I forgot what I was going to do',
        reasonDateTime: moment().toISOString(),
        site: sitesBody[0].url,
      };

      const { status, body } = await global.testRequest
        .post('/reasons')
        .set({ 'x-access-token': token })
        .send(newReason);

      expect(status).toBe(StatusCodes.CREATED);
      expect(body).toEqual(expect.objectContaining(newReason));
    });
  });
});
