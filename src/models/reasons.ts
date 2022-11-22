import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IReason {
  _id?: string;
  content: string;
  reasonDateTime: string;
}

const schema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    reasonDateTime: { type: String, required: true },
    site: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
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

export interface ReasonModel extends Omit<IReason, '_id'>, Document {}
export const Reason: Model<ReasonModel> = mongoose.model<ReasonModel>(
  'Reason',
  schema
);
