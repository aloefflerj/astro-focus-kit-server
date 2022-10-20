import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import { StatusCodes } from 'http-status-codes';

describe('Users functional tests with encrypted password', () => {
  beforeEach(async () => await User.deleteMany({}));
  describe('When creating a new user', () => {
    it('should successfully create a new user', async () => {
      const newUser = {
        name: 'dovahkiin',
        email: 'dovahkiin@skyrim.com',
        password: '12345',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201);
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

    it('should return 400 when there is a validation error', async () => {
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
});
