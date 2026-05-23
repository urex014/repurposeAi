// models/Transaction.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amountPaid: number;
  creditsAdded: number;
  paystackReference: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amountPaid: { type: Number, required: true },
    creditsAdded: { type: Number, required: true },
    paystackReference: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

const Transaction: Model<ITransaction> = 
  mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
export default Transaction;