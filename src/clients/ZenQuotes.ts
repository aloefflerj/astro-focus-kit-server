import quotes from './quotes.json';

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
  public async fetchRandomQuote(): Promise<ZenQuotesQuote> {
    const randomQuote = this.getRandomFromJson(quotes);

    return this.normalizeResponse(randomQuote);
  }

  private normalizeResponse(response: ZenQuotesQuoteResponse): ZenQuotesQuote {
    return {
      quote: response.q,
      author: response.a,
    };
  }

  private getRandomFromJson(quotes: ZenQuotesQuoteResponse[]) {
    const randomNumber = this.randomIntFromInterval(0, 49);
    return quotes[randomNumber];
  }

  private randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
