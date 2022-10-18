import { AxiosStatic } from 'axios';

export interface ZenQuotesQuoteResponse {
  q: string;
  a: string;
  h: string;
}

export interface ZenQuotesQuote {
  quote: string;
  author: string;
}

export class ZenQuotes {
  constructor(protected request: AxiosStatic) {}

  public async fetchRandomQuote(): Promise<ZenQuotesQuote[]> {
    const response = await this.request.get<ZenQuotesQuoteResponse[]>(
      'https://zenquotes.io/api/random'
    );

    return this.normalizeResponse(response.data);
  }

  private normalizeResponse(
    response: ZenQuotesQuoteResponse[]
  ): ZenQuotesQuote[] {
    return response.filter(this.isValidQuote.bind(this)).map((quote) => ({
      quote: quote.q,
      author: quote.a,
    }));
  }

  private isValidQuote(quote: Partial<ZenQuotesQuoteResponse>): boolean {
    return !!(quote.q && quote.a);
  }
}
