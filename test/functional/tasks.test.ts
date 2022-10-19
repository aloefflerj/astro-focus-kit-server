import { Task } from '@src/models/task';
import taskResponseFixture from '@test/fixtures/taskResponseFixture.json';

describe('Tasks functional tests', () => {
  beforeAll(async () => await Task.deleteMany({}));
  beforeEach(async () => {
    const defaultTask = taskResponseFixture;
    const task = new Task(defaultTask);
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
      const newTask = taskResponseFixture;

      const response = await global.testRequest.post('/tasks').send(newTask);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newTask));
    });

    it('should return 422 when there is a validation error', async () => {
      const newTask = taskResponseFixture;
      const response = await global.testRequest.post('/tasks').send(newTask);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: `Task validation failed: urgent: Cast to Boolean failed for value "THIS IS NOT A VALID VALUE" (type string) at path "urgent" because of "CastError"`,
      });
    });
  });
});
