import app from '@src/app';
import supertest from 'supertest';

describe('Tasks functional tests', () => {
  it('should return a task', async () => {
    const { body, status } = await supertest(app).get('/tasks');
    expect(status).toBe(200);
    expect(body).toBe([
      {
        task: [
          {
            id: '123',
            title: 'surfar',
          },
        ],
      },
    ]);
  });
});
