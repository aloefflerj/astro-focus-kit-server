import { User } from '@src/models/user';
import { StatusCodes } from 'http-status-codes';

describe('Sessions functional tests', () => {
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

  describe('When creating a user', () => {
    it('should create a focusing session by default', async () => {
      const newSession = {
        status: 'focusing',
      };

      const { status, body } = await global.testRequest
        .get('/session')
        .set({ 'x-access-token': token });

      expect(status).toBe(StatusCodes.CREATED);
      expect(body).toEqual(expect.objectContaining(newSession));
    });
  });
});
