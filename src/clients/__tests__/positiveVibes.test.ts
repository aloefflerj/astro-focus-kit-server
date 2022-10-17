import { PositiveVibes } from '@src/clients/PositiveVibes';

describe('PositiveVibes client', () => {
  it('should return the normalizes forecast from the PositiveVibes service', async () => {
    const positiveVibes = new PositiveVibes();
    const response = await positiveVibes.fetchRandomQuote();
    expect(response).toEqual({});
  });
});
