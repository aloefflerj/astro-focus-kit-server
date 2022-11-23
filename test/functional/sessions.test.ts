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
        .get('/sessions')
        .set({ 'x-access-token': token });

      expect(status).toBe(StatusCodes.CREATED);
      expect(body).toEqual(expect.objectContaining(newSession));
    });
  });

  describe('When modifying session status', () => {
    it('should change status to "procrastinating" on flip status', async () => {
      const sessionNewStatus = {
        status: 'procrastinating',
      };

      const { body } = await global.testRequest
        .get('/sessions')
        .set({ 'x-access-token': token });

      const { status: sessionStatus } = await global.testRequest
        .patch(`/sessions/${body.id}`)
        .set({ 'x-access-token': token })
        .send(sessionNewStatus);

      const { body: sessionBody } = await global.testRequest
        .get('/sessions')
        .set({ 'x-access-token': token });

      expect(sessionStatus).toBe(StatusCodes.NO_CONTENT);
      expect(sessionBody).toEqual(expect.objectContaining(sessionNewStatus));
    });

    it('should change status when searching by user without session id', async () => {
      const sessionNewStatus = {
        status: 'procrastinating',
      };

      const { status: sessionStatus } = await global.testRequest
        .patch('/sessions')
        .set({ 'x-access-token': token })
        .send(sessionNewStatus);

      const { body: sessionBody } = await global.testRequest
        .get('/sessions')
        .set({ 'x-access-token': token });

      expect(sessionStatus).toBe(StatusCodes.NO_CONTENT);
      expect(sessionBody).toEqual(expect.objectContaining(sessionNewStatus));
    });
  });
});
