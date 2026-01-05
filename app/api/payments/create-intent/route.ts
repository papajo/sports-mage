import { NextResponse } from 'next/server';
import { createPaymentIntent } from '../../../../../lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = 'usd', userId } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // In production, verify user authentication here

    const paymentIntent = await createPaymentIntent(amount, currency, userId);

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent?.client_secret,
      paymentIntentId: paymentIntent?.id,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

