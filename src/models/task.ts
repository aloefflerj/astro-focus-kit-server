import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITask {
  _id?: string;
  order: number;
  title: string;
  type: 'binary' | 'timer' | 'pomodoro';
  status: 'onCourse' | 'done' | 'todo';
  urgent: boolean;
  important: boolean;
  description?: string;
  registerDate: string;
  conclusionDate?: string;
}

const schema = new mongoose.Schema(
  {
    order: { type: Number, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    urgent: { type: Boolean, required: true },
    important: { type: Boolean, required: true },
    description: { type: String, required: false },
    registerDate: { type: Date, required: true },
    conclusionDate: { type: Date, required: false },
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

interface TaskModel extends Omit<ITask, '_id'>, Document {}
export const Task: Model<TaskModel> = mongoose.model<TaskModel>('Task', schema);
