// app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

// Helper to authenticate requests
async function authenticateUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

// GET: Fetch current user settings
export async function GET() {
  try {
    const userId = await authenticateUser();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const user = await User.findById(userId).select('name email');
    
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, user: { name: user.name, email: user.email } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update profile or password
export async function PUT(request: NextRequest) {
  try {
    const userId = await authenticateUser();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { action } = body;

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // --- HANDLE PROFILE UPDATE ---
    if (action === 'update_profile') {
      const { name, email } = body;
      if (!name || !email) return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });

      // Check if the new email is already taken by someone else
      if (email.toLowerCase() !== user.email) {
        const existingEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingEmail) return NextResponse.json({ error: 'Email is already in use' }, { status: 409 });
      }

      user.name = name;
      user.email = email.toLowerCase();
      await user.save();

      return NextResponse.json({ success: true, message: 'Profile updated successfully' }, { status: 200 });
    }

    // --- HANDLE PASSWORD UPDATE ---
    if (action === 'update_password') {
      const { currentPassword, newPassword } = body;
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: 'Both current and new passwords are required' }, { status: 400 });
      }

      if (!user.password) {
        return NextResponse.json({ error: 'No password is set for this account.' }, { status: 400 });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Incorrect current password' }, { status: 401 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return NextResponse.json({ success: true, message: 'Password changed successfully' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });

  } catch (error) {
    console.error('[Settings Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}