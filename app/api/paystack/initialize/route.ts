// app/api/paystack/initialize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/db';
import Transaction from '@/models/Transaction';
import User from '@/models/User';

// Define our strict pricing packages to prevent tampering
const PACKAGES: Record<string, { credits: number; priceNaira: number }> = {
  '5000': { credits: 5000, priceNaira: 5000 },
  '25000': { credits: 25000, priceNaira: 25000 },
  '50000': { credits: 50000, priceNaira: 50000 },
  '80000': { credits: 80000, priceNaira: 80000 },
  '100000': { credits: 100000, priceNaira: 100000 },
};

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    
    // 2. Validate Request
    const { packageId } = await request.json();
    const selectedPackage = PACKAGES[packageId];

    if (!selectedPackage) {
      return NextResponse.json({ error: 'Invalid package selected' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // 3. Generate a unique reference and create the pending transaction FIRST
    const reference = `REP-${crypto.randomBytes(8).toString('hex')}-${Date.now()}`;

    await Transaction.create({
      userId: user._id,
      amountPaid: selectedPackage.priceNaira,
      creditsAdded: selectedPackage.credits,
      paystackReference: reference,
      status: 'pending',
    });

    // 4. Initialize with Paystack
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const amountInKobo = selectedPackage.priceNaira * 100;

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountInKobo,
        reference: reference,
        // Redirect back to our frontend verify page, NOT the raw JSON API route
        callback_url: `${baseUrl}/dashboard/billing/verify`,
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || 'Failed to initialize Paystack');
    }

    // 5. Return the authorization URL to the frontend
    return NextResponse.json({
      success: true,
      authorization_url: paystackData.data.authorization_url,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Paystack Init Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}