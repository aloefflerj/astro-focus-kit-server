import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITimer {
  _id?: string;
  time: number;
}

const schema = new mongoose.Schema(
  {
    time: { type: Number, required: true },
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

export interface TimerModel extends Omit<ITimer, '_id'>, Document {}
export const Timer: Model<TimerModel> = mongoose.model<TimerModel>(
  'Timer',
  schema
);
