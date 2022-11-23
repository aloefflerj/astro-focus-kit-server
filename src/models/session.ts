import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISession {
  _id?: string;
  status: 'focusing' | 'procrastinating';
}

const schema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export interface SessionModel extends Omit<ISession, '_id'>, Document {}
export const Session: Model<SessionModel> = mongoose.model<SessionModel>(
  'Session',
  schema
);
