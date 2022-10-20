import { User } from '@src/models/user';

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
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'User validation failed: name: Path `name` is required.',
      });
    });
  });
});