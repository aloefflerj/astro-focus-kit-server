import { Task, TaskModel } from '@src/models/task';
import { Types } from 'mongoose';

export default class TasksService {
  public async reorderTasks(
    triggerTaskId: string,
    newOrder: number,
    destinationDate: string,
    userId: string | undefined
  ): Promise<TaskModel[] | void> {
    const triggerTask = await Task.findById(triggerTaskId);
    if (triggerTask === null) return;
    if (destinationDate !== triggerTask.registerDate) {
      this.reorderSourceTasks;
    }
    const destinationDayTasks = await this.reorderDestinationTasks(
      triggerTask,
      newOrder,
      destinationDate,
      userId
    );
    return [...destinationDayTasks];
  }

  private reorderSourceTasks() {
    //TODO: reorder source day tasks
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
      registerDate: triggerTask?.registerDate,
      user: userId,
    }).sort({ order: 'asc' });
  }
}
