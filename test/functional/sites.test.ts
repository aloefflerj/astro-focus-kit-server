import { defaultWebsitesToBlock } from '@src/clients/defaultValues/defaultWebsitesToBlock';
import { Site } from '@src/models/site';
import { Task } from '@src/models/task';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import { StatusCodes } from 'http-status-codes';
import moment from 'moment-timezone';

describe('Sites functional tests', () => {
  const defaultUser = {
    name: 'dovahkiin',
    email: 'dovahkiin@skyrim.com',
    password: '12345',
  };

  let token: string;

  beforeEach(async () => {
    await Site.deleteMany({});
    await Task.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    token = AuthService.generateToken(user.toJSON());
  });

  afterAll(async () => await User.deleteMany({}));

  describe('When creating sites config for a given user', () => {
    it('should create website sites config successfuly', async () => {
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
        .post('/sites')
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

  describe('When fetching sites from a given user', () => {
    it('should return default sites if the user has no config', async () => {
      const newUser = {
        name: 'dovahkiin2',
        email: 'dovahkiin@skyrim.com2',
        password: '12345',
      };

      await global.testRequest.post('/users').send(newUser);

      const { body: userBody } = await global.testRequest
        .post('/users/auth')
        .send({ email: newUser.email, password: newUser.password });

      const { status, body } = await global.testRequest
        .get('/sites')
        .set({ 'x-access-token': userBody.token });

      expect(status).toBe(StatusCodes.OK);
      expect(body).toEqual(
        defaultWebsitesToBlock.map(({ url }) => {
          return expect.objectContaining({ url, user: userBody.id });
        })
      );
    });

    it('should return custom sites if the user has websites config', async () => {
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

      await global.testRequest
        .post('/sites')
        .set({ 'x-access-token': token })
        .send(newSites);

      const { status, body } = await global.testRequest
        .get('/sites')
        .set({ 'x-access-token': token });

      expect(status).toEqual(StatusCodes.OK);

      expect(body).toEqual([
        expect.objectContaining(newSites[0]),
        expect.objectContaining(newSites[1]),
        expect.objectContaining(newSites[2]),
      ]);
    });

    it('should return a single site config reference if searched by id', async () => {
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

      const { body: sitesBody } = await global.testRequest
        .post('/sites')
        .set({ 'x-access-token': token })
        .send(newSites);

      const { status, body } = await global.testRequest
        .get(`/sites/${sitesBody[0].id}`)
        .set({ 'x-access-token': token });

      expect(status).toBe(StatusCodes.OK);
      expect(body).toEqual(expect.objectContaining(newSites[0]));
    });
  });

  describe('When fetching sites from a given user with tasks setted', () => {
    it('should return empty if the user has no task registered today', async () => {
      const { status, body } = await global.testRequest
        .get('/sites/block')
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
        .get('/sites/block')
        .set({ 'x-access-token': token });

      expect(status).toEqual(StatusCodes.OK);

      expect(body).toEqual(defaultWebsitesToBlock);
    });
  });

  describe('When updating a site config', () => {
    it('should update the value accordantly', async () => {
      const newSite = [
        {
          url: 'youtube.com',
        },
      ];

      await global.testRequest
        .post('/sites')
        .set({ 'x-access-token': token })
        .send(newSite);

      const { body: oldBody } = await global.testRequest
        .get('/sites')
        .set({ 'x-access-token': token });

      const { status } = await global.testRequest
        .patch(`/sites/${oldBody[0].id}`)
        .set({ 'x-access-token': token })
        .send([
          {
            url: 'facebook.com',
          },
        ]);

      const { body } = await global.testRequest
        .get('/sites')
        .set({ 'x-access-token': token });

      expect(status).toEqual(StatusCodes.NO_CONTENT);
      expect(body).toEqual([
        expect.objectContaining({
          url: 'facebook.com',
        }),
      ]);
    });
  });

  describe('When deleting a site config', () => {
    it('should delete a site config with success', async () => {
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

      await global.testRequest
        .post('/sites')
        .set({ 'x-access-token': token })
        .send(newSites);

      const { body } = await global.testRequest
        .get('/sites')
        .set({ 'x-access-token': token });

      const response = await global.testRequest
        .delete(`/sites/${body[0].id}`)
        .set({ 'x-access-token': token });

      expect(response.status).toBe(StatusCodes.NO_CONTENT);
    });
  });
});
