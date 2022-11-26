import { defaultWebsitesToBlock } from '@src/clients/defaultValues/defaultWebsitesToBlock';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import { StatusCodes } from 'http-status-codes';

describe('Users functional tests with encrypted password', () => {
  beforeEach(async () => await User.deleteMany({}));
  afterAll(async () => await User.deleteMany({}));
  describe('When creating a new user', () => {
    it('should successfully create a new user', async () => {
      const newUser = {
        name: 'dovahkiin',
        email: 'dovahkiin@skyrim.com',
        password: '12345',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(StatusCodes.CREATED);
      await expect(
        AuthService.comparePasswords(newUser.password, response.body.password)
      ).resolves.toBeTruthy();
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        })
      );
    });

    it('should successfully create default user sites to block config', async () => {
      const newUser = {
        name: 'dovahkiin',
        email: 'dovahkiin@skyrim.com',
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

    it('should return 422 when there is a validation error', async () => {
      const newUser = {
        //empty name
        email: 'dovahkiin@skyrim.com',
        password: '12345',
      };
      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(response.body).toEqual({
        code: StatusCodes.UNPROCESSABLE_ENTITY,
        error: 'User validation failed: name: Path `name` is required.',
      });
    });

    it('should return 409 when the return email already exists', async () => {
      const newUser = {
        name: 'dovahkiin',
        email: 'dovahkiin@skyrim.com',
        password: '12345',
      };
      await global.testRequest.post('/users').send(newUser);
      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(StatusCodes.CONFLICT);
      expect(response.body).toEqual({
        code: StatusCodes.CONFLICT,
        error: 'User validation failed: email: already exists in the database.',
      });
    });
  });

  describe('When authenticating a user', () => {
    it('should generate a token for a valid user', async () => {
      const newUser = {
        name: 'dovahkiin',
        email: 'dovahkiin@skyrim.com',
        password: '12345',
      };
      await new User(newUser).save();
      const response = await global.testRequest
        .post('/users/auth')
        .send({ email: newUser.email, password: newUser.password });

      expect(response.body).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      );
    });

    it('should return UNAUTHORIZED if the user with the given email is not found', async () => {
      const response = await global.testRequest
        .post('/users/auth')
        .send({ email: 'email@not.found', password: '1234' });

      expect(response.status).toBe(401);
    });

    it('should return UNAUTHORIZED if the user is found but the password does not match', async () => {
      const newUser = {
        name: 'dovahkiin',
        email: 'dovahkiin@skyrim.com',
        password: '12345',
      };
      await new User(newUser).save();
      const response = await global.testRequest
        .post('/users/auth')
        .send({ email: newUser.email, password: 'wrong password' });

      expect(response.status).toBe(401);
    });
  });
});
