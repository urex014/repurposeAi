// app/api/paystack/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db'; // Adjust if you kept '@/lib/mongodb'
import Transaction from '@/models/Transaction';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    // 1. Get the raw body as a string for crypto verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY as string;

    // 2. Hash the raw body using HMAC SHA512 and your secret key
    const hash = crypto
      .createHmac('sha512', secret)
      .update(rawBody)
      .digest('hex');

    // 3. Compare our hash with Paystack's signature
    if (hash !== signature) {
      console.error('[Paystack Webhook] Invalid signature match.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 4. Safe to parse the JSON now
    const event = JSON.parse(rawBody);

    // 5. We only care about successful charges for this MVP
    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;
      const amountInNaira = data.amount / 100;

      await connectToDatabase();

      const transaction = await Transaction.findOne({ paystackReference: reference });

      // If no transaction exists, log it but return 200 so Paystack stops retrying
      if (!transaction) {
        console.error(`[Paystack Webhook] Transaction not found for ref: ${reference}`);
        return NextResponse.json({ success: true }, { status: 200 });
      }

      // Idempotency: If already processed (e.g., by the client-side verify route), do nothing
      if (transaction.status === 'success' || transaction.status === 'failed') {
        return NextResponse.json({ success: true, message: 'Already processed' }, { status: 200 });
      }

      // Verify the amount to prevent tampering
      if (Math.abs(amountInNaira - transaction.amountPaid) > 0.01) {
        transaction.status = 'failed';
        await transaction.save();
        return NextResponse.json({ success: true, message: 'Amount mismatch' }, { status: 200 });
      }

      // Atomic transaction to update both records safely
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        transaction.status = 'success';
        await transaction.save({ session });

        const user = await User.findByIdAndUpdate(
          transaction.userId,
          { $inc: { credits: transaction.creditsAdded } },
          { new: true, session }
        );

        //affiliate logic

        if (user && user.referredBy) {
          const bonusCredits = Math.floor(transaction.creditsAdded * 0.20); // 20% commission
          
          await User.findByIdAndUpdate(
            user.referredBy,
            { 
              $inc: { 
                credits: bonusCredits,
                referralCreditsEarned: bonusCredits 
              } 
            },
            { session }
          );
          console.log(`[Affiliate] Credited ${bonusCredits} to referrer.`);
        }

        await session.commitTransaction();
        console.log(`[Paystack Webhook] Successfully credited ${transaction.creditsAdded} to user.`);
      } catch (error) {
        await session.abortTransaction();
        throw error; // Let the outer catch block handle it
      } finally {
        await session.endSession();
      }
    }

    // 6. Always return a 200 OK to acknowledge receipt of the webhook
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('[Paystack Webhook Error]:', error);
    // Returning a 500 tells Paystack to retry this event later
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}