import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Transaction, { ITransaction } from '@/models/Transaction';
import User, { IUser } from '@/models/User';
import mongoose from 'mongoose';

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    reference: string;
    amount: number;
    paid_at: string;
    customer: {
      id: number;
      email: string;
    };
    status: string;
  };
}

/**
 * Verifies a Paystack transaction and credits the user
 * GET /api/paystack/verify?reference=<reference>
 */
export async function GET(request: NextRequest) {
  try {
    // Extract reference from query parameters
    const reference = request.nextUrl.searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Missing transaction reference' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find the transaction by Paystack reference
    const transaction = await Transaction.findOne({
      paystackReference: reference,
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // **Idempotency Check**: If already processed, return success without re-crediting
    if (transaction.status === 'success') {
      return NextResponse.json(
        {
          success: true,
          message: 'Transaction already verified',
          transaction: {
            id: transaction._id,
            reference: transaction.paystackReference,
            status: transaction.status,
            creditsAdded: transaction.creditsAdded,
          },
        },
        { status: 200 }
      );
    }

    // If already failed, don't retry verification
    if (transaction.status === 'failed') {
      return NextResponse.json(
        { error: 'This transaction was marked as failed' },
        { status: 400 }
      );
    }

    // Verify with Paystack API
    const paystackResponse = await verifyWithPaystack(reference);

    if (!paystackResponse.status) {
      // Mark transaction as failed
      transaction.status = 'failed';
      await transaction.save();

      return NextResponse.json(
        { error: paystackResponse.message || 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Verify the amount matches to prevent tampering
    const amountInKobo = paystackResponse.data.amount;
    const amountInNaira = amountInKobo / 100;

    if (Math.abs(amountInNaira - transaction.amountPaid) > 0.01) {
      transaction.status = 'failed';
      await transaction.save();

      return NextResponse.json(
        { error: 'Payment amount mismatch' },
        { status: 400 }
      );
    }

    // Start a session for atomic transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update transaction status to success
      transaction.status = 'success';
      await transaction.save({ session });

      // Increment user credits
      const user = await User.findByIdAndUpdate(
        transaction.userId,
        { $inc: { credits: transaction.creditsAdded } },
        { new: true, session }
      );

      if (!user) {
        await session.abortTransaction();
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Commit the transaction
      await session.commitTransaction();

      return NextResponse.json(
        {
          success: true,
          message: 'Payment verified successfully',
          transaction: {
            id: transaction._id,
            reference: transaction.paystackReference,
            status: transaction.status,
            creditsAdded: transaction.creditsAdded,
          },
          user: {
            id: user._id,
            email: user.email,
            totalCredits: user.credits,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error('Paystack verification error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Verifies the payment with Paystack API
 */
async function verifyWithPaystack(
  reference: string
): Promise<PaystackVerifyResponse> {
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!paystackSecretKey) {
    throw new Error('PAYSTACK_SECRET_KEY environment variable is not set');
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Paystack API error: ${response.status} ${response.statusText}`
    );
  }

  const data: PaystackVerifyResponse = await response.json();
  return data;
}
