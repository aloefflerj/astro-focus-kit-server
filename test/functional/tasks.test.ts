describe('Tasks functional tests', () => {
  describe('When fetching tasks', () => {
    it('should return a task', async () => {
      const { body, status } = await global.testRequest.get('/tasks');
      expect(status).toEqual(200);
      expect(body).toEqual([
        {
          id: '1',
          order: 2,
          title: 'piano',
          type: 'binary',
          status: 'todo',
          urgent: false,
          important: false,
          description: null,
          registerDate: '2022/10/17',
          conclusionDate: null,
        },
        {
          id: '3',
          order: 3,
          title: 'painting',
          type: 'binary',
          status: 'todo',
          urgent: false,
          important: false,
          description: null,
          registerDate: '2022/10/18',
          conclusionDate: null,
        },
      ]);
    });
  });

  // describe('When creating a task', () => {
  //   it('should create a task with success', async () => {
  //     const newTask = {
  //       id: '3',
  //       order: 3,
  //       title: 'study',
  //       type: 'binary',
  //       status: 'todo',
  //       urgent: false,
  //       important: false,
  //       description: null,
  //       registerDate: '2022/10/19',
  //       conclusionDate: null,
  //     };

  //     const response = await global.testRequest.post('/tasks').send(newTask);
  //     expect(response.status).toBe(201);
  //     expect(response.body).toEqual(newTask);
  //   });
  // });
});
