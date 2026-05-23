// models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional if implementing OAuth later
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  credits: number;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  referralCode: string;
  referredBy?: mongoose.Types.ObjectId;
  referralsCount: number;
  referralEarnings: number;
  referralCreditsEarned?: number;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    credits: { type: Number, default: 100 }, // Default free starter credits
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    referralsCount: { type: Number, default: 0 },
    referralEarnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;