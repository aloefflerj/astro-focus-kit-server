import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISite {
  _id?: string;
  url: string;
}

const schema = new mongoose.Schema(
  {
    url: { type: String, required: true },
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

export interface SiteModel extends Omit<ISite, '_id'>, Document {}
export const Site: Model<SiteModel> = mongoose.model<SiteModel>('Site', schema);
