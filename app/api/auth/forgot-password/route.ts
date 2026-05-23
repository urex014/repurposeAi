// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // We always return a 200 OK even if the user doesn't exist to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({ success: true, message: 'If an account exists, a reset link was sent.' }, { status: 200 });
    }

    // 1. Generate a raw random token for the email link
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2. Hash the token to store in the database (security best practice)
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 3. Set expiration time (e.g., 1 hour from now)
    const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);

    // 4. Save the hashed token and expiry to the user record
    user.resetPasswordToken = passwordResetToken;
    user.resetPasswordExpires = passwordResetExpires;
    await user.save();

    // 5. Construct the reset URL
    // In production, use your actual domain from environment variables
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // 6. SEND THE EMAIL (Placeholder)
    // Replace this with your preferred email service (Resend, SendGrid, Nodemailer)
    console.log(`[EMAIL SIMULATION] Send to: ${user.email}`);
    console.log(`[EMAIL SIMULATION] Reset Link: ${resetUrl}`);
    // await sendEmail({ to: user.email, subject: 'Password Reset', body: `Click here: ${resetUrl}` });

    return NextResponse.json({ 
      success: true, 
      message: 'If an account exists, a reset link was sent.' 
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Forgot Password Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}