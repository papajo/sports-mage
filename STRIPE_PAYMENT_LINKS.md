# Stripe Payment Links Integration

## Overview

Stripe Payment Links provide a **no-code solution** for accepting payments. You can create payment pages through the Stripe Dashboard or programmatically via the API. This is perfect for quick setup and simple payment flows.

**Reference**: [Stripe Payment Links Documentation](https://docs.stripe.com/payment-links/create)

## Benefits of Payment Links

✅ **No Code Required** - Create payment pages directly in Stripe Dashboard  
✅ **Quick Setup** - Get started in minutes  
✅ **Stripe-Hosted** - Stripe handles the payment page  
✅ **Multiple Payment Methods** - Supports 40+ payment methods automatically  
✅ **Multi-Language** - Supports 30+ languages  
✅ **Adaptive Pricing** - Customers can pay in their local currency  
✅ **Mobile Optimized** - Works great on mobile devices  

## Use Cases for SportsMage

### 1. Wallet Deposits (Fixed Amount)
- User wants to deposit a specific amount (e.g., $50)
- Create a Payment Link with that amount
- User clicks link → Pays → Redirected back to app

### 2. Wallet Deposits (Custom Amount)
- User chooses how much to deposit
- Create a Payment Link with "custom amount" option
- User enters amount → Pays → Redirected back

### 3. Subscription Payments
- Premium tier ($9.99/month)
- Pro tier ($29.99/month)
- Create Payment Links for each subscription tier

## Implementation Options

### Option 1: Manual Creation (No Code) ⭐ Recommended for MVP

**Steps:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/payment-links)
2. Click **+ New** → **Payment link**
3. Configure:
   - **Type**: Product/Service or Subscription
   - **Name**: "Wallet Deposit" or "Premium Subscription"
   - **Price**: Set amount or allow custom amount
   - **Success URL**: `https://yoursite.com/payment/success?session_id={CHECKOUT_SESSION_ID}`
   - **Cancel URL**: `https://yoursite.com/payment/cancel`
4. Click **Create link**
5. Copy the link and use it in your app

**Example Links:**
- Wallet Deposit ($50): `https://buy.stripe.com/your-link-id`
- Premium Subscription: `https://buy.stripe.com/your-subscription-link`
- Custom Amount Deposit: `https://buy.stripe.com/your-custom-link`

### Option 2: Programmatic Creation (API)

We've implemented API endpoints that create Payment Links programmatically:

```typescript
// Fixed amount deposit
POST /api/payments/create-link
{
  "amount": 50,
  "currency": "usd",
  "userId": "user-123",
  "successUrl": "https://yoursite.com/payment/success",
  "cancelUrl": "https://yoursite.com/payment/cancel"
}

// Custom amount deposit
POST /api/payments/create-link
{
  "customAmount": true,
  "userId": "user-123",
  "successUrl": "https://yoursite.com/payment/success",
  "cancelUrl": "https://yoursite.com/payment/cancel",
  "minAmount": 10,
  "maxAmount": 1000
}
```

## Comparison: Payment Links vs Payment Intents

| Feature | Payment Links | Payment Intents |
|---------|--------------|-----------------|
| **Setup Time** | Minutes (no code) | Hours (requires code) |
| **Customization** | Limited (Stripe-hosted) | Full control |
| **Best For** | Simple payments, MVP | Complex flows, custom UI |
| **Hosting** | Stripe-hosted | Your domain |
| **Mobile** | Optimized automatically | You handle optimization |
| **Payment Methods** | 40+ automatically | You configure |

## Recommended Approach for SportsMage

### Phase 1 (MVP) - Use Payment Links
- ✅ Quick to implement
- ✅ No code changes needed
- ✅ Professional payment pages
- ✅ Works immediately

**Steps:**
1. Create Payment Links in Stripe Dashboard for:
   - Wallet deposits (common amounts: $25, $50, $100, $250, $500)
   - Custom amount deposit
   - Premium subscription
   - Pro subscription
2. Store link URLs in environment variables or database
3. Use links in your wallet deposit UI

### Phase 2 (Advanced) - Hybrid Approach
- Use Payment Links for simple flows
- Use Payment Intents for complex flows (betting, live payments)

## Setup Instructions

### 1. Create Payment Links in Dashboard

#### Wallet Deposit Links

**Fixed Amount ($50 example):**
1. Dashboard → Payment Links → **+ New**
2. Type: **Sell a product or service**
3. Name: "Wallet Deposit - $50"
4. Price: $50.00 USD
5. Success URL: `https://yoursite.com/payment/success?type=deposit&amount=50`
6. Cancel URL: `https://yoursite.com/payment/cancel`
7. Click **Create link**
8. Copy the link (e.g., `https://buy.stripe.com/...`)

**Custom Amount:**
1. Dashboard → Payment Links → **+ New**
2. Type: **Customers choose what to pay**
3. Name: "Wallet Deposit - Custom Amount"
4. (Optional) Preset amount: $25
5. (Optional) Min: $10, Max: $1000
6. Success URL: `https://yoursite.com/payment/success?type=deposit`
7. Cancel URL: `https://yoursite.com/payment/cancel`
8. Click **Create link**

#### Subscription Links

**Premium Tier ($9.99/month):**
1. First, create a Product and Price in Stripe Dashboard:
   - Products → **+ Add product**
   - Name: "SportsMage Premium"
   - Pricing: $9.99/month, Recurring
   - Save and copy the Price ID (e.g., `price_xxx`)
2. Dashboard → Payment Links → **+ New**
3. Type: **Sell a subscription**
4. Select the Premium price
5. Success URL: `https://yoursite.com/payment/success?type=subscription&tier=premium`
6. Cancel URL: `https://yoursite.com/payment/cancel`
7. Click **Create link**

### 2. Store Links in Environment Variables

Add to `.env.local`:

```env
# Stripe Payment Links (created in Dashboard)
# Test Payment Link (for development/testing)
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_TEST=https://buy.stripe.com/test_eVq4gB5P89Nvb1X7RL5ZC00

# Production Payment Links (create these in Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_DEPOSIT_25=https://buy.stripe.com/xxx
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_DEPOSIT_50=https://buy.stripe.com/xxx
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_DEPOSIT_100=https://buy.stripe.com/xxx
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_DEPOSIT_250=https://buy.stripe.com/xxx
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_DEPOSIT_CUSTOM=https://buy.stripe.com/xxx
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_SUBSCRIPTION_PREMIUM=https://buy.stripe.com/xxx
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_SUBSCRIPTION_PRO=https://buy.stripe.com/xxx

# Enable Payment Links (set to 'true' to use Payment Links instead of Payment Intents)
NEXT_PUBLIC_USE_PAYMENT_LINKS=true
```

**Note**: The test Payment Link (`NEXT_PUBLIC_STRIPE_PAYMENT_LINK_TEST`) is already configured and will be used as a fallback if other links are not set. This allows you to test the payment flow immediately.

### 3. Use Links in Your App

```typescript
// components/Wallet/DepositButton.tsx
'use client';

export default function DepositButton({ amount }: { amount: number }) {
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_DEPOSIT_50;
  
  return (
    <a 
      href={paymentLink}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg"
    >
      Deposit ${amount}
    </a>
  );
}
```

### 4. Handle Webhooks

Payment Links trigger the same webhook events as regular payments. Update your webhook handler to process them:

```typescript
// app/api/payments/webhook/route.ts
case 'checkout.session.completed':
  const session = event.data.object;
  // Check metadata for type
  if (session.metadata?.type === 'wallet_deposit') {
    // Update user wallet balance
  }
  break;
```

## Webhook Events

Payment Links trigger these events:
- `checkout.session.completed` - Payment successful
- `checkout.session.async_payment_succeeded` - Async payment succeeded
- `checkout.session.async_payment_failed` - Async payment failed

## Testing

1. Use Stripe test mode
2. Test cards: `4242 4242 4242 4242` (success)
3. Test Payment Links in test mode
4. Verify webhook events in Dashboard → Developers → Webhooks

## Advantages for SportsMage

1. **Faster Time to Market** - No payment UI development needed
2. **Professional Look** - Stripe's optimized payment pages
3. **Mobile First** - Automatically optimized for mobile
4. **International** - Supports 150+ countries, 40+ payment methods
5. **Less Maintenance** - Stripe handles updates and security
6. **Lower Development Cost** - No custom payment UI needed

## Limitations

1. **Less Customization** - Can't fully customize the payment page
2. **Stripe Branding** - Payment page is on Stripe's domain
3. **Redirect Required** - Users leave your site (can use iframe in some cases)

## Best Practices

1. **Use for MVP** - Start with Payment Links, upgrade later if needed
2. **Multiple Links** - Create links for common amounts ($25, $50, $100)
3. **Track Analytics** - Use UTM parameters in success URLs
4. **Test Thoroughly** - Test all payment flows before launch
5. **Monitor Webhooks** - Set up proper webhook handling

## Next Steps

1. ✅ Create Payment Links in Stripe Dashboard
2. ✅ Add links to environment variables
3. ✅ Create wallet deposit UI components
4. ✅ Update webhook handler for Payment Links
5. ✅ Test payment flows
6. ✅ Deploy and monitor

---

**Reference Links:**
- [Create Payment Links](https://docs.stripe.com/payment-links/create)
- [Payment Links API](https://docs.stripe.com/payment-links/api)
- [Share Payment Links](https://docs.stripe.com/payment-links/share)
- [Track Payment Links](https://docs.stripe.com/payment-links/track)

