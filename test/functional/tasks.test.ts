describe('Tasks functional tests', () => {
  it('should return a task', async () => {
    const { body, status } = await global.testRequest.get('/tasks');
    expect(status).toEqual(200);
    expect(body).toEqual([
      {
        id: '12345',
        task: 'study',
      },
      {
        id: '678910',
        task: 'read',
      },
    ]);
  });
});
