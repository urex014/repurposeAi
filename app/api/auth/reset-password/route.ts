// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    // 1. Hash the incoming raw token so we can compare it to the database hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    await connectToDatabase();

    // 2. Find the user with this exact token AND check if it hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() } // Ensures expiration date is strictly in the future
    });

    if (!user) {
      return NextResponse.json({ error: 'Token is invalid or has expired' }, { status: 400 });
    }

    // 3. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update the user password and clear the reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Password has been successfully reset. You can now log in.' 
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Reset Password Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}