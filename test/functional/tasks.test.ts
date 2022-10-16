import supertest from 'supertest';

describe('Tasks functional tests', () => {
  it('should return a task', async () => {
    const { body, status } = await supertest(app).get('/tasks');
    expect(status).toBe(200);
    expect(body).toBe([
      {
        id: '12345',
        task: 'study',
      },
    ]);
  });
});
