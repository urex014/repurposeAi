// models/AiTask.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAiTask extends Document {
  userId: mongoose.Types.ObjectId;
  taskType: string;
  input: string;
  output: string;
  creditsConsumed: number;
  createdAt: Date;
}

const AiTaskSchema = new Schema<IAiTask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    taskType: { type: String, required: true },
    input: { type: String, required: true },
    output: { type: String, required: true },
    creditsConsumed: { type: Number, required: true },
  },
  { timestamps: true }
);

const AiTask: Model<IAiTask> = 
  mongoose.models.AiTask || mongoose.model<IAiTask>('AiTask', AiTaskSchema);
export default AiTask;