import config, { IConfig } from 'config';
import { connect as mongooseConnect, connection } from 'mongoose';

const dbConfig: IConfig = config.get('App.database');
const prefix = dbConfig.get('prefix');
const user = dbConfig.get('user');
const pass = dbConfig.get('pass');
const host = dbConfig.get('host');
const port = dbConfig.get('port');
const db = dbConfig.get('db');
const authSource = dbConfig.get('authSource');

export const connect = async (): Promise<void> => {
  await mongooseConnect(
    `mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=${authSource}`
  );
};

export const close = (): Promise<void> => connection.close();
