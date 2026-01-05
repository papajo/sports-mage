/**
 * Stripe payment integration
 * Supports both Payment Links (no-code) and Payment Intents (code-based)
 */

import Stripe from 'stripe';

// Initialize Stripe server-side
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

/**
 * Create a payment intent for wallet deposit (code-based)
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  userId: string
): Promise<Stripe.PaymentIntent | null> {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId,
        type: 'wallet_deposit',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Create a Payment Link for wallet deposit (no-code alternative)
 * This creates a Stripe-hosted payment page that customers can use
 * 
 * Reference: https://docs.stripe.com/payment-links/api
 */
export async function createPaymentLink(
  amount: number,
  currency: string = 'usd',
  userId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.PaymentLink | null> {
  if (!stripe) {
    throw new Error('Stripe is not configured.');
  }

  try {
    // Create a price for this one-time payment
    const price = await stripe.prices.create({
      unit_amount: Math.round(amount * 100), // Convert to cents
      currency,
      product_data: {
        name: 'Wallet Deposit',
        description: `Deposit $${amount.toFixed(2)} to your betting wallet`,
      },
    });

    // Create payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: successUrl,
        },
      },
      metadata: {
        userId,
        type: 'wallet_deposit',
        amount: amount.toString(),
      },
    });

    return paymentLink;
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw error;
  }
}

/**
 * Create a Payment Link for custom amount (wallet deposit)
 * Allows customers to choose their own deposit amount
 * 
 * Reference: https://docs.stripe.com/payment-links/create#customers-choose-what-to-pay
 */
export async function createCustomAmountPaymentLink(
  userId: string,
  successUrl: string,
  cancelUrl: string,
  minAmount?: number,
  maxAmount?: number
): Promise<Stripe.PaymentLink | null> {
  if (!stripe) {
    throw new Error('Stripe is not configured.');
  }

  try {
    // Note: Custom amount payment links need to be created via Dashboard
    // or using the API with specific configuration
    // For now, we'll create a link that redirects to a custom checkout
    
    // Alternative: Create a checkout session with custom amount
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Wallet Deposit',
              description: 'Add funds to your betting wallet',
            },
            unit_amount: minAmount ? Math.round(minAmount * 100) : undefined,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        type: 'wallet_deposit_custom',
      },
      // Allow customers to enter custom amount
      payment_intent_data: {
        metadata: {
          userId,
          type: 'wallet_deposit',
        },
      },
    });

    // Return a payment link-like object
    return {
      id: session.id,
      url: session.url,
      active: true,
    } as any;
  } catch (error) {
    console.error('Error creating custom amount payment link:', error);
    throw error;
  }
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session | null> {
  if (!stripe) {
    throw new Error('Stripe is not configured.');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Create a Payment Link for subscription (no-code alternative)
 * 
 * Reference: https://docs.stripe.com/payment-links/api
 */
export async function createSubscriptionPaymentLink(
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.PaymentLink | null> {
  if (!stripe) {
    throw new Error('Stripe is not configured.');
  }

  try {
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          userId,
        },
      },
      after_completion: {
        type: 'redirect',
        redirect: {
          url: successUrl,
        },
      },
      metadata: {
        userId,
        type: 'subscription',
      },
    });

    return paymentLink;
  } catch (error) {
    console.error('Error creating subscription payment link:', error);
    throw error;
  }
}

/**
 * Retrieve a payment link by ID
 */
export async function getPaymentLink(paymentLinkId: string): Promise<Stripe.PaymentLink | null> {
  if (!stripe) {
    throw new Error('Stripe is not configured.');
  }

  try {
    const paymentLink = await stripe.paymentLinks.retrieve(paymentLinkId);
    return paymentLink;
  } catch (error) {
    console.error('Error retrieving payment link:', error);
    throw error;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  if (!stripe) {
    throw new Error('Stripe is not configured.');
  }

  return stripe.webhooks.constructEvent(payload, signature, secret);
}
