import { User } from '@src/models/user';
import { StatusCodes } from 'http-status-codes';

describe('Users functional tests', () => {
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
      expect(response.body).toEqual(expect.objectContaining(newUser));
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

    it('shoudl return 409 when the return email already exists', async () => {
      const newUser = {
        name: 'dovahkiin',
        email: 'dovahkiin@skyrim.com',
        password: '12345',
      };
      await global.testRequest.post('/users').send(newUser);
      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(StatusCodes.CONFLICT);
      expect(response.body.error).toBe(
        'User validation failed: email: already exists in the database.'
      );
    });
  });
});
