import { defaultBlockedWebsites } from '@src/clients/defaultValues/defaultBlockedWebsites';
import { Block } from '@src/models/block';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import { StatusCodes } from 'http-status-codes';

describe('Blocks functional tests', () => {
  const defaultUser = {
    name: 'dovahkiin',
    email: 'dovahkiin@skyrim.com',
    password: '12345',
  };

  let token: string;

  beforeEach(async () => {
    await Block.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    token = AuthService.generateToken(user.toJSON());
  });

  describe('When fetching blocks from a given user', () => {
    it('should return default blocks if the user has no config', async () => {
      const { status, body } = await global.testRequest
        .get('/blocks')
        .set({ 'x-access-token': token });

      expect(status).toEqual(StatusCodes.OK);

      expect(body).toEqual(defaultBlockedWebsites);
    });
  });
});
