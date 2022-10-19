// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface global {}
declare global {
  // eslint-disable-next-line no-var
  var testRequest: import('supertest').SuperTest<import('supertest').Test>;
}
