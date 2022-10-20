import { User } from '@src/models/user';

describe('Users functional tests', () => {
  beforeEach(async () => await User.deleteMany({}));
  describe('When creating a new user', () => {
    it('should successfully creat a new user', async () => {
      const newUser = {
        name: 'dovahkiin',
        email: 'dovahkiin@skyrim.com',
        password: '12345',
      };

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newUser));
    });
  });
});
