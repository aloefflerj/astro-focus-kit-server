import { Task } from '@src/models/task';
import taskResponseFixture from '@test/fixtures/taskResponseFixture.json';

describe('Tasks functional tests', () => {
  beforeAll(async () => await Task.deleteMany({}));
  beforeEach(async () => {
    const task = new Task(taskResponseFixture);
    await task.save();
  });
  describe('When fetching tasks', () => {
    it('should return a task', async () => {
      const { body, status } = await global.testRequest.get('/tasks');
      expect(status).toEqual(200);
      expect(body).toEqual([expect.objectContaining(taskResponseFixture)]);
    });
  });

  describe('When creating a task', () => {
    it('should create a task with success', async () => {
      const response = await global.testRequest
        .post('/tasks')
        .send(taskResponseFixture);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining(taskResponseFixture)
      );
    });

    it('should return 422 when there is a validation error', async () => {
      const invalidValue = {
        order: 2,
        title: 'study',
        type: 'binary',
        status: 'todo',
        urgent: 'THIS IS NOT A VALID VALUE',
        important: false,
        description: null,
        registerDate: '2022-10-17T03:00:00.000Z',
        conclusionDate: null,
      };

      const response = await global.testRequest
        .post('/tasks')
        .send(invalidValue);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: `Task validation failed: urgent: Cast to Boolean failed for value "THIS IS NOT A VALID VALUE" (type string) at path "urgent" because of "CastError"`,
      });
    });
  });
});
