import config, { IConfig } from 'config';
import { connect as mongooseConnect, connection } from 'mongoose';

const dbConfig: IConfig = config.get('App.database');
const mongoConnection = dbConfig.get<string>('connection');

export const connect = async (): Promise<void> => {
  await mongooseConnect(mongoConnection);
};

export const close = (): Promise<void> => connection.close();
