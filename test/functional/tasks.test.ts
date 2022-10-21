import { Task } from '@src/models/task';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import taskResponseFixture from '@test/fixtures/taskResponseFixture.json';
import tasksResponseFixtures from '@test/fixtures/tasksResponseFixture.json';
import { StatusCodes } from 'http-status-codes';

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
        .set({ 'x-access-token': token })
        .send(invalidValue);
      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(response.body).toEqual({
        code: StatusCodes.UNPROCESSABLE_ENTITY,
        error: `Task validation failed: urgent: Cast to Boolean failed for value "THIS IS NOT A VALID VALUE" (type string) at path "urgent" because of "CastError"`,
      });
    });
  });
});
