import { defaultBlockedWebsites } from '@src/clients/defaultValues/defaultBlockedWebsites';
import { Block } from '@src/models/block';
import { Task } from '@src/models/task';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import { StatusCodes } from 'http-status-codes';
import moment from 'moment-timezone';

describe('Blocks functional tests', () => {
  const defaultUser = {
    name: 'dovahkiin',
    email: 'dovahkiin@skyrim.com',
    password: '12345',
  };

  let token: string;

  beforeEach(async () => {
    await Block.deleteMany({});
    await Task.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    token = AuthService.generateToken(user.toJSON());
  });

  describe('When fetching blocks from a given user', () => {
    it('should return default blocks if the user has no config', async () => {
      const { status, body } = await global.testRequest
        .get('/blocks/config')
        .set({ 'x-access-token': token });

      expect(status).toEqual(StatusCodes.OK);

      expect(body).toEqual(defaultBlockedWebsites);
    });
  });

  describe('When fetching blocks from a given user with tasks setted', () => {
    it('should return empty if the user has no task registered today', async () => {
      const { status, body } = await global.testRequest
        .get('/blocks')
        .set({ 'x-access-token': token });

      expect(status).toEqual(StatusCodes.OK);

      expect(body).toEqual([]);
    });

    it('should return blocked sites if the user has a task registered today', async () => {
      const newTask = {
        order: 1,
        title: 'read a book',
        type: 'binary',
        status: 'todo',
        urgent: false,
        important: false,
        description: null,
        registerDate: moment(),
        conclusionDate: null,
        deleted: false,
      };

      await global.testRequest
        .post('/tasks')
        .set({ 'x-access-token': token })
        .send(newTask);

      const { status, body } = await global.testRequest
        .get('/blocks')
        .set({ 'x-access-token': token });

      expect(status).toEqual(StatusCodes.OK);

      expect(body).toEqual(defaultBlockedWebsites);
    });
  });
  describe('When creating blocks config for a given user', () => {
    it('should create website blocks config successfuly', async () => {
      const newSites = [
        {
          url: 'youtube.com',
        },
        {
          url: 'facebook.com',
        },
        {
          url: 'itch.io',
        },
      ];

      const { status, body } = await global.testRequest
        .post('/blocks/config')
        .set({ 'x-access-token': token })
        .send(newSites);

      expect(status).toBe(StatusCodes.CREATED);
      expect(body).toEqual([
        expect.objectContaining(newSites[0]),
        expect.objectContaining(newSites[1]),
        expect.objectContaining(newSites[2]),
      ]);
    });
  });
});
