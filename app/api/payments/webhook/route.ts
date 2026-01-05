import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '../../../../lib/stripe';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature, webhookSecret);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        // Payment Link or Checkout Session completed
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const amount = session.amount_total ? session.amount_total / 100 : null; // Convert from cents
        
        if (userId && amount) {
          console.log('Payment succeeded via checkout session:', session.id, 'User:', userId, 'Amount:', amount);
          
          // Update user wallet
          try {
            const walletResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/api/betting/wallet`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId,
                action: 'deposit',
                amount,
                transactionId: session.id,
              }),
            });
            
            if (!walletResponse.ok) {
              console.error('Failed to update wallet:', await walletResponse.text());
            }
          } catch (err) {
            console.error('Error updating wallet:', err);
          }
        }
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as any;
        const intentUserId = paymentIntent.metadata?.userId;
        const intentAmount = paymentIntent.amount ? paymentIntent.amount / 100 : null;
        
        if (intentUserId && intentAmount) {
          console.log('Payment succeeded via payment intent:', paymentIntent.id, 'User:', intentUserId, 'Amount:', intentAmount);
          
          // Update user wallet
          try {
            const walletResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/api/betting/wallet`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: intentUserId,
                action: 'deposit',
                amount: intentAmount,
                transactionId: paymentIntent.id,
              }),
            });
            
            if (!walletResponse.ok) {
              console.error('Failed to update wallet:', await walletResponse.text());
            }
          } catch (err) {
            console.error('Error updating wallet:', err);
          }
        }
        break;

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object);
        // TODO: Notify user of failed payment
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as any;
        const subUserId = subscription.metadata?.userId;
        console.log('Subscription updated:', subscription.id, 'User:', subUserId);
        // TODO: Update user subscription tier in database
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

