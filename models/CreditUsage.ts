// models/CreditUsage.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICreditUsage extends Document {
  userId: mongoose.Types.ObjectId;
  service: 'summarize' | 'rewrite' | 'blog' | 'linkedin' | 'captions' | 'email' | 'study-notes' | 'analyze';
  creditsUsed: number;
  prompt: string;
  createdAt: Date;
}

const CreditUsageSchema = new Schema<ICreditUsage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    service: { 
      type: String, 
      enum: ['summarize', 'rewrite', 'blog', 'linkedin', 'captions', 'email', 'study-notes', 'analyze'], 
      required: true 
    },
    creditsUsed: { type: Number, required: true },
    prompt: { type: String, required: true },
  },
  { timestamps: true }
);

const CreditUsage: Model<ICreditUsage> = 
  mongoose.models.CreditUsage || mongoose.model<ICreditUsage>('CreditUsage', CreditUsageSchema);
export default CreditUsage;