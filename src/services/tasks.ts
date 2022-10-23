import { Task, TaskModel } from '@src/models/task';
import { Types } from 'mongoose';
import moment from 'moment';

export default class TasksService {
  public async reorderTasks(
    triggerTaskId: string,
    newOrder: number,
    destinationDate: string,
    userId: string | undefined
  ): Promise<TaskModel[] | void> {
    const triggerTask = await Task.findById(triggerTaskId);
    if (triggerTask === null) throw new Error('Task does not exists');

    const sourceDate = moment(triggerTask.registerDate);
    const destinDate = moment(destinationDate);

    let sourceDayTasks: (TaskModel & { _id: Types.ObjectId })[] = [];
    if (!sourceDate.isSame(destinDate, 'day')) {
      sourceDayTasks = await this.reorderSourceTasks(
        triggerTask,
        destinationDate,
        userId
      );
    }

    const destinationDayTasks = await this.reorderDestinationTasks(
      triggerTask,
      newOrder,
      destinationDate,
      userId
    );
    const orderedDayTasks = [...sourceDayTasks, ...destinationDayTasks].sort(
      (prev, curr) =>
        new Date(prev.registerDate).getTime() -
          new Date(curr.registerDate).getTime() || curr.order - curr.order
    );
    return orderedDayTasks;
  }

  private async reorderSourceTasks(
    triggerTask: TaskModel & {
      _id: Types.ObjectId;
    },
    destinationDate: string,
    userId: string | undefined
  ) {
    const tasks = await Task.find({
      _id: { $ne: triggerTask._id },
      user: userId,
      registerDate: triggerTask.registerDate,
      order: { $gte: triggerTask.order },
      deleted: false,
    }).sort({ order: 'asc' });

    const sourceDate = triggerTask.registerDate;
    triggerTask.registerDate = destinationDate;
    await triggerTask.save();

    await Promise.all(
      tasks.map(async (task) => {
        task.order--;
        await task.save();
      })
    );

    return await Task.find({
      registerDate: sourceDate,
      user: userId,
      deleted: false,
    }).sort({ order: 'asc' });
  }

  private async reorderDestinationTasks(
    triggerTask: TaskModel & {
      _id: Types.ObjectId;
    },
    newOrder: number,
    destinationDate: string,
    userId: string | undefined
  ) {
    const tasks = await Task.find({
      _id: { $ne: triggerTask._id },
      user: userId,
      registerDate: destinationDate,
      order: { $gte: newOrder },
      deleted: false,
    }).sort({ order: 'asc' });

    triggerTask.order = newOrder;
    await triggerTask.save();

    await Promise.all(
      tasks.map(async (task) => {
        task.order++;
        await task.save();
      })
    );

    return await Task.find({
      registerDate: destinationDate,
      user: userId,
      deleted: false,
    }).sort({ order: 'asc' });
  }
}
