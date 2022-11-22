import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBlock {
  _id?: string;
  blockDateTime: string;
}

const schema = new mongoose.Schema(
  {
    blockDateTime: { type: String, required: true },
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

export interface BlockModel extends Omit<IBlock, '_id'>, Document {}
export const Block: Model<BlockModel> = mongoose.model<BlockModel>(
  'Block',
  schema
);
