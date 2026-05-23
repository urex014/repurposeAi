// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, ref } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const referralCode = `REP-${randomBytes(3).toString('hex')}`;

    // 2. Check if they were referred
    let referredById = null;
    if (ref) {
      const referrer = await User.findOne({ referralCode: ref });
      if (referrer) referredById = referrer._id;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
    }

    // Hash the password (10 salt rounds is standard and secure)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      credits: 20, // 20 starter credits
      referralCode,          // <--- ADD THIS
      ...(referredById && { referredBy: referredById }),
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    // Set the JWT in an HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        credits: newUser.credits,
        referralCode,
        referredBy: referredById,
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('[Register Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}