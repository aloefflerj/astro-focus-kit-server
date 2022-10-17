describe('Tasks functional tests', () => {
  describe('When fetching tasks', () => {
    it('should return a task', async () => {
      const { body, status } = await global.testRequest.get('/tasks');
      expect(status).toEqual(200);
      expect(body).toEqual([
        {
          id: '12345',
          task: 'study',
        },
        {
          id: '678910',
          task: 'read',
        },
      ]);
    });
  });

  describe('When creating a task', () => {
    it('should create a task with success', async () => {
      const newTask = {
        id: '12345678910',
        order: 20,
        title: 'study',
        type: 'binary',
        status: 'todo',
        urgent: false,
        important: false,
        description: null,
        registerDate: '2022/10/17',
        conclusionDate: null,
      };

      const response = await global.testRequest.post('/tasks').send(newTask);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(newTask);
    });
  });
});

// export interface ITask {
//   id: string;
//   order: number;
//   title: string;
//   type: 'binary' | 'timer' | 'pomodoro';
//   status: 'onCourse' | 'done' | 'todo';
//   urgent: boolean;
//   important: boolean;
//   description?: string;
//   registerDate: string;
//   conclusionDate?: string;
// }
