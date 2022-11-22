import { Site, SiteModel, ISite } from '@src/models/site';
import { Task } from '@src/models/task';
import moment from 'moment-timezone';

export default class SiteService {
  public async createsNewSiteConfigForLoggedUser(
    sites: ISite[],
    userId: string | undefined
  ): Promise<SiteModel[]> {
    if (userId === undefined) return [];

    const formattedSites = sites.map(({ url }) => {
      return { url, user: userId };
    });

    const insertedSites = await Site.insertMany(formattedSites);
    return insertedSites;
  }

  public async getSitesFromLoggedUser(userId: string): Promise<SiteModel[]> {
    return await Site.find({
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
