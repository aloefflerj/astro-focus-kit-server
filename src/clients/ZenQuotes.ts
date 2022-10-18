import { AxiosStatic } from 'axios';

export class ZenQuotes {
  constructor(protected request: AxiosStatic) {}

  public async fetchRandomQuote(): Promise<Record<string, never>> {
    return this.request.get('https://zenquotes.io/api/random');
  }
}
