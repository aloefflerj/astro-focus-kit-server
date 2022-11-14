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
  });
});
