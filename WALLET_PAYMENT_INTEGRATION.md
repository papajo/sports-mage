# Wallet, Payment & Authentication Integration

## Overview

The wallet, Stripe payment, and authentication systems are now fully integrated and streamlined. All wallet operations are user-specific and tied to authenticated accounts.

## Key Changes

### 1. **User-Specific Wallets** ✅
- Each authenticated user has their own wallet
- Wallet balance is stored server-side (API) and synced with client
- Wallet starts at $0.00 - users must deposit funds

### 2. **Authentication Required** ✅
- Wallet page requires authentication
- Unauthenticated users are redirected to login
- User ID is used for all wallet operations

### 3. **Stripe Payment Integration** ✅
- Payment Links redirect to success page
- Success page updates wallet via API
- Webhook handles Payment Link and Payment Intent events
- Wallet balance is updated automatically after successful payment

### 4. **Streamlined Flow** ✅
- Deposit → Stripe Payment → Success Page → Wallet Updated
- All operations are logged and tracked
- Transaction IDs are stored for reference

## Architecture

### Components

1. **Authentication (`lib/auth-helpers.ts`)**
   - `getCurrentUser()` - Get current user from localStorage
   - `isAuthenticated()` - Check if user is logged in
   - `requireAuth()` - Require authentication (redirects if not)

2. **Wallet API (`/api/betting/wallet`)**
   - `GET` - Fetch user wallet
   - `POST` - Update wallet (deposit, withdraw, deduct, add_winnings)
   - User-specific operations

3. **Payment Success Page (`/payment/success`)**
   - Processes successful payments
   - Updates wallet via API
   - Shows transaction details

4. **Stripe Webhook (`/api/payments/webhook`)**
   - Handles `checkout.session.completed` events
   - Handles `payment_intent.succeeded` events
   - Updates wallet automatically

## User Flow

### Deposit Flow

1. **User clicks "Deposit"**
   - Must be authenticated
   - Redirects to login if not

2. **Redirect to Stripe Payment Link**
   - User enters payment details on Stripe-hosted page
   - Payment is processed by Stripe

3. **Payment Success**
   - Stripe redirects to `/payment/success?session_id=xxx&amount=xxx`
   - Success page:
     - Gets user from localStorage
     - Calls `/api/betting/wallet` to update balance
     - Shows success message

4. **Webhook Processing** (parallel)
   - Stripe sends webhook to `/api/payments/webhook`
   - Webhook verifies payment and updates wallet
   - Ensures wallet is updated even if user closes browser

### Wallet Operations

- **Deposit**: Add funds to wallet
- **Withdraw**: Remove funds from wallet
- **Deduct**: Deduct for bet placement
- **Add Winnings**: Add winnings from won bets

## API Endpoints

### GET `/api/betting/wallet?user_id={userId}`
Returns user's wallet balance and statistics.

**Response:**
```json
{
  "success": true,
  "wallet": {
    "balance": 100.00,
    "currency": "USD",
    "pending_bets": 50.00,
    "total_won": 200.00,
    "total_lost": 30.00
  }
}
```

### POST `/api/betting/wallet`
Update wallet balance.

**Request:**
```json
{
  "userId": "user-123",
  "action": "deposit",
  "amount": 100.00,
  "transactionId": "pi_xxx"
}
```

**Actions:**
- `deposit` - Add funds
- `withdraw` - Remove funds
- `deduct` - Deduct for bet
- `add_winnings` - Add winnings

## Stripe Payment Links Setup

### For Production

When creating Payment Links in Stripe Dashboard:

1. **Success URL**: 
   ```
   https://yoursite.com/payment/success?session_id={CHECKOUT_SESSION_ID}&amount={AMOUNT}
   ```

2. **Cancel URL**:
   ```
   https://yoursite.com/payment/cancel
   ```

3. **Metadata** (if creating programmatically):
   - Add `userId` to metadata so webhook can identify user

### For Testing

Use the test Payment Link:
```
https://buy.stripe.com/test_eVq4gB5P89Nvb1X7RL5ZC00
```

Configure success URL in Stripe Dashboard to:
```
http://localhost:3003/payment/success?session_id={CHECKOUT_SESSION_ID}
```

## Webhook Configuration

### Stripe Dashboard Setup

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://yoursite.com/api/payments/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy webhook secret to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

### Local Testing

Use Stripe CLI:
```bash
stripe listen --forward-to localhost:3003/api/payments/webhook
```

This will give you a webhook secret for local testing.

## Security Considerations

1. **Authentication Required**: All wallet operations require authentication
2. **User Verification**: User ID is verified on all API calls
3. **Webhook Verification**: Stripe webhook signatures are verified
4. **Transaction Tracking**: All transactions are logged with IDs

## Current Limitations

1. **In-Memory Storage**: Wallet data is stored in memory (will be lost on restart)
   - **Solution**: Replace with database in production

2. **Payment Link Metadata**: Payment Links created in Dashboard can't include user ID
   - **Solution**: Use programmatic Payment Link creation or handle via success URL

3. **Session Management**: Using localStorage for sessions
   - **Solution**: Implement proper JWT or NextAuth.js sessions

## Next Steps

1. **Database Integration**
   - Store wallets in database
   - Persist across server restarts
   - Add transaction history

2. **Enhanced Payment Links**
   - Create Payment Links programmatically with user metadata
   - Dynamic success URLs with user ID

3. **Transaction History**
   - Track all deposits, withdrawals, bets
   - Show in wallet page
   - Export functionality

4. **Withdrawal System**
   - Add withdrawal functionality
   - Multiple payment methods
   - Processing time estimates

## Testing

### Test Deposit Flow

1. Log in or register
2. Go to `/betting/wallet`
3. Enter deposit amount
4. Click "Deposit"
5. Use test card: `4242 4242 4242 4242`
6. Complete payment
7. Verify wallet balance updated

### Test Webhook

1. Use Stripe CLI to forward webhooks
2. Make a test payment
3. Check webhook logs
4. Verify wallet updated

---

**Last Updated**: 2025-01-XX
**Status**: ✅ Integrated and Streamlined

