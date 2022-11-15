import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import { StatusCodes } from 'http-status-codes';

describe('Ping functional tests', () => {
  describe('When ping to server', () => {
    it('should return 200 status', async () => {
      const { status } = await global.testRequest.get('/ping');
      expect(status).toBe(StatusCodes.OK);
    });
  });

  describe('When ping to required auth server', () => {
    it("should return 401 status if a given user isn't logged in", async () => {
      const { status } = await global.testRequest.get('/ping/auth');
      expect(status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should return 200 status if a given user is logged in', async () => {
      await User.deleteMany({});

      const user = await new User({
        name: 'dovahkiin',
        email: 'dovahkiin@skyrim.com',
        password: '12345',
      }).save();

      const token = AuthService.generateToken(user.toJSON());

      const { status } = await global.testRequest
        .get('/ping/auth')
        .set({ 'x-access-token': token });

      expect(status).toBe(StatusCodes.OK);
    });
  });
});
