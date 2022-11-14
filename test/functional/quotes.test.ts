describe('Quotes functional tasks', () => {
  describe('When fetching a quote', () => {
    it('should get a random quote', async () => {
      const response = await global.testRequest.get('/quotes');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          author: expect.any(String),
          quote: expect.any(String),
        })
      );
    });
  });
});
