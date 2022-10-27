import { Task } from '@src/models/task';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import taskResponseFixture from '@test/fixtures/taskResponseFixture.json';
import tasksResponseFixtures from '@test/fixtures/tasksResponseFixture.json';
import { StatusCodes } from 'http-status-codes';
const newTask = {
  order: 3,
  title: 'read a book',
  type: 'binary',
  status: 'todo',
  urgent: false,
  important: false,
  description: null,
  registerDate: '2022-10-17T03:00:00.000Z',
  conclusionDate: null,
  deleted: false,
};

describe('Tasks functional tests', () => {
  const defaultUser = {
    name: 'dovahkiin',
    email: 'dovahkiin@skyrim.com',
    password: '12345',
  };
  let token: string;

  beforeEach(async () => {
    await Task.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    token = AuthService.generateToken(user.toJSON());
  });

  describe('When creating a task', () => {
    it('should create a task with success', async () => {
      const response = await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
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
        deleted: false,
      };

      const response = await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
        .send(invalidValue);
      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(response.body).toEqual({
        code: StatusCodes.UNPROCESSABLE_ENTITY,
        error: `Task validation failed: urgent: Cast to Boolean failed for value "THIS IS NOT A VALID VALUE" (type string) at path "urgent" because of "CastError"`,
      });
    });
  });

  describe('When fetching tasks from a given user', () => {
    it('should return user tasks', async () => {
      await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
        .send(tasksResponseFixtures[0]);

      await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
        .send(tasksResponseFixtures[1]);

      const { body, status } = await global.testRequest
        .get('/tasks')
        .set({ 'x-access-token': token });
      expect(status).toEqual(StatusCodes.OK);

      expect(body).toEqual([
        expect.objectContaining(tasksResponseFixtures[0]),
        expect.objectContaining(tasksResponseFixtures[1]),
      ]);
    });
  });

  describe('When reordering a task', () => {
    it('should reorder all tasks in a given day when reordering is made on the same day', async () => {
      await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
        .send(tasksResponseFixtures[0]);

      await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
        .send(tasksResponseFixtures[1]);

      const response = await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
        .send(newTask);

      const { body, status } = await global.testRequest
        .patch(`/tasks/reorder/${response.body.id}`)
        .set({ 'x-access-token': token })
        .send({ order: 2, destinationDate: '2022-10-17T03:00:00.000Z' });

      expect(status).toEqual(StatusCodes.OK);
      expect(body).toEqual([
        expect.objectContaining({ ...tasksResponseFixtures[0], order: 1 }),
        expect.objectContaining({ ...newTask, order: 2 }),
        expect.objectContaining({ ...tasksResponseFixtures[1], order: 3 }),
      ]);
    });

    it(`should reorder all tasks from both source and destination 
        days when reordering is made from one day to another`, async () => {
      const response = await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
        .send(tasksResponseFixtures[0]);

      await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
        .send(tasksResponseFixtures[1]);

      await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
        .send(newTask);

      const firstTaskOnAnotherDay = { ...tasksResponseFixtures[0] };
      firstTaskOnAnotherDay.registerDate = '2022-10-18T03:00:00.000Z';
      firstTaskOnAnotherDay.title = 'draw';
      await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
        .send(firstTaskOnAnotherDay);

      const secondTaskOnAnotherDay = { ...tasksResponseFixtures[1] };
      secondTaskOnAnotherDay.registerDate = '2022-10-18T03:00:00.000Z';
      secondTaskOnAnotherDay.title = 'send important email';
      await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
        .send(secondTaskOnAnotherDay);

      const { body, status } = await global.testRequest
        .patch(`/tasks/reorder/${response.body.id}`)
        .set({ 'x-access-token': token })
        .send({ order: 1, destinationDate: '2022-10-18T03:00:00.000Z' });

      expect(status).toEqual(StatusCodes.OK);
      expect(body).toEqual([
        expect.objectContaining({ ...tasksResponseFixtures[1], order: 1 }),
        expect.objectContaining({ ...newTask, order: 2 }),
        expect.objectContaining({
          ...tasksResponseFixtures[0],
          registerDate: '2022-10-18T03:00:00.000Z',
          order: 1,
        }),
        expect.objectContaining({ ...firstTaskOnAnotherDay, order: 2 }),
        expect.objectContaining({ ...secondTaskOnAnotherDay, order: 3 }),
      ]);
    });
  });

  describe('When deleting a task', () => {
    it('should return delete a tasks with success', async () => {
      const { body } = await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
        .send(tasksResponseFixtures[0]);

      const response = await global.testRequest
        .delete(`/tasks/${body.id}`)
        .set({ 'x-access-token': token });

      expect(response.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should return 404 when a task is not found', async () => {
      await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
        .send(tasksResponseFixtures[0]);

      const response = await global.testRequest
        .delete('/tasks/6352117a4d6dbb3e56c39e40') //not valid
        .set({ 'x-access-token': token });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('When updating a taks', () => {
    it('should return updated task with success', async () => {
      const { body: createdTaskBody } = await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
        .send(tasksResponseFixtures[0]);

      const { status } = await global.testRequest
        .put(`tasks/${createdTaskBody.id}`)
        .set({ 'x-access-token': token })
        .send({ title: 'New Title' });

      expect(status).toBe(StatusCodes.NO_CONTENT);
      expect.objectContaining({ ...createdTaskBody, title: 'New Title' });
    });
  });
});
