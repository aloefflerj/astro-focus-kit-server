import { ZenQuotes } from '@src/clients/ZenQuotes';
import axios from 'axios';
import zenQuotesFixture from '@test/fixtures/zenQuotesFixture.json';
import zenQuotesNormalizedFixture from '@test/fixtures/zenQuotesNormalizedFixture.json';

jest.mock('axios');

describe('ZenQuotes client', () => {
  it('should return the normalized quote from the ZenQuotes service', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: zenQuotesFixture });
    const zenQuotes = new ZenQuotes(axios);
    const response = await zenQuotes.fetchRandomQuote();

    expect(response).toEqual(zenQuotesNormalizedFixture);
  });
});
