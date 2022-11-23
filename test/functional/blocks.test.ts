import { User } from '@src/models/user';
import { StatusCodes } from 'http-status-codes';
import moment from 'moment-timezone';

describe('Blocks functional tests', () => {
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

  describe('When blocking a website', () => {
    it('should create a log of the site block', async () => {
      const { body: sitesBody } = await global.testRequest
        .get('/sites/config')
        .set({ 'x-access-token': token });

      const newBlock = {
        site: sitesBody[0].id,
        blockDateTime: moment().toISOString(),
      };

      const { status, body } = await global.testRequest
        .post('/blocks')
        .set({ 'x-access-token': token })
        .send(newBlock);

      expect(status).toBe(StatusCodes.CREATED);
      expect(body).toEqual(expect.objectContaining(newBlock));
    });
  });

  describe('When fetching last block by user', () => {
    it('should return the most recent user site block', async () => {
      const { body: sitesBody } = await global.testRequest
        .get('/sites/config')
        .set({ 'x-access-token': token });

      const oldestBlock = {
        site: sitesBody[0].id,
        blockDateTime: moment().toISOString(),
      };

      const newestBlock = {
        site: sitesBody[0].id,
        blockDateTime: moment().toISOString(),
      };

      await global.testRequest
        .post('/blocks')
        .set({ 'x-access-token': token })
        .send(oldestBlock);

      await global.testRequest
        .post('/blocks')
        .set({ 'x-access-token': token })
        .send(newestBlock);

      const { status, body } = await global.testRequest
        .get('/blocks/last')
        .set({ 'x-access-token': token });

      expect(status).toBe(StatusCodes.OK);
      expect(body).toEqual(expect.objectContaining(newestBlock));
    });
  });
});
