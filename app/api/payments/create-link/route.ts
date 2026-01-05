import { NextResponse } from 'next/server';
import { createPaymentLink, createCustomAmountPaymentLink } from '../../../../lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      amount, 
      currency = 'usd', 
      userId, 
      successUrl, 
      cancelUrl,
      customAmount = false,
      minAmount,
      maxAmount 
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!successUrl || !cancelUrl) {
      return NextResponse.json(
        { success: false, error: 'Success and cancel URLs are required' },
        { status: 400 }
      );
    }

    // In production, verify user authentication here

    let paymentLink;

    if (customAmount) {
      // Create payment link with custom amount (customer chooses)
      paymentLink = await createCustomAmountPaymentLink(
        userId,
        successUrl,
        cancelUrl,
        minAmount,
        maxAmount
      );
    } else {
      // Create payment link with fixed amount
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { success: false, error: 'Amount is required for fixed amount payments' },
          { status: 400 }
        );
      }

      paymentLink = await createPaymentLink(
        amount,
        currency,
        userId,
        successUrl,
        cancelUrl
      );
    }

    return NextResponse.json({
      success: true,
      paymentLinkUrl: paymentLink?.url,
      paymentLinkId: paymentLink?.id,
      message: 'Payment link created successfully',
    });
  } catch (error: any) {
    console.error('Error creating payment link:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create payment link' },
      { status: 500 }
    );
  }
}

