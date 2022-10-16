import mongoose from 'mongoose';

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOSTNAME, MONGO_PORT, MONGO_DB } =
  process.env;

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

const options = {
  useNewUrlParser: true,
  //   reconnectTries: Number.MAX_VALUE,
  //   reconnectInterval: 500,
  connectTimeoutMS: 10000,
};

const dbConfig = () => {
  mongoose.connect(url, options);
};

export default dbConfig;
