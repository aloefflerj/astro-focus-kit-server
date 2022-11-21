import { Block, BlockModel } from '@src/models/block';
import { Task } from '@src/models/task';
import moment from 'moment-timezone';

export default class BlockService {
  public async getBlocksFromLoggedUser(userId: string): Promise<BlockModel[]> {
    return await Block.find({
      user: userId,
    });
  }
  public async hasAnyTaskForTheDay(userId: string): Promise<boolean> {
    const startOfTheDay = moment().startOf('day');
    const endOfTheDay = moment().add('day').endOf('day');

    const tasks = await Task.find({
      user: userId,
      deleted: false,
      registerDate: { $gte: startOfTheDay, $lte: endOfTheDay },
      status: { $ne: 'done' },
    });

    if (tasks.length === 0) return false;

    return true;
  }
}
