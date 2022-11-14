import { StatusCodes } from 'http-status-codes';

describe('Ping functional tests', () => {
  describe('When ping to server', () => {
    it('should return 200 status', async () => {
      const { status } = await global.testRequest.get('/ping');
      expect(status).toBe(StatusCodes.OK);
    });
  });
});
