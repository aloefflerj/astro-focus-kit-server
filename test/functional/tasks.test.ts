import { Task } from '@src/models/task';

describe('Tasks functional tests', () => {
  beforeAll(async () => await Task.deleteMany({}));
  beforeEach(async () => {
    const defaultTask = {
      order: 2,
      title: 'piano',
      type: 'binary',
      status: 'todo',
      urgent: false,
      important: false,
      description: null,
      registerDate: '2022/10/17',
      conclusionDate: null,
    };
    const task = new Task(defaultTask);
    await task.save();
  });
  describe('When fetching tasks', () => {
    it('should return a task', async () => {
      const { body, status } = await global.testRequest.get('/tasks');
      expect(status).toEqual(200);
      expect(body).toEqual([
        expect.objectContaining({
          order: 2,
          title: 'study',
          type: 'binary',
          status: 'todo',
          urgent: false,
          important: false,
          description: null,
          registerDate: '2022-10-17T03:00:00.000Z',
          conclusionDate: null,
        }),
      ]);
    });
  });

  describe('When creating a task', () => {
    it('should create a task with success', async () => {
      const newTask = {
        order: 3,
        title: 'study',
        type: 'binary',
        status: 'todo',
        urgent: false,
        important: false,
        description: null,
        registerDate: '2022-10-19T03:00:00.000Z',
        conclusionDate: null,
      };

      const response = await global.testRequest.post('/tasks').send(newTask);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newTask));
    });

    it('should return 422 when there is a validation error', async () => {
      const newTask = {
        order: 3,
        title: 'study',
        type: 'binary',
        status: 'todo',
        urgent: 'THIS IS NOT A VALID VALUE',
        important: false,
        description: null,
        registerDate: '2022-10-19T03:00:00.000Z',
        conclusionDate: null,
      };
      const response = await global.testRequest.post('/tasks').send(newTask);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: `Task validation failed: urgent: Cast to Boolean failed for value "THIS IS NOT A VALID VALUE" (type string) at path "urgent" because of "CastError"`,
      });
    });
  });
});
