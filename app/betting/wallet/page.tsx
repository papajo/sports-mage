'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBettingContext } from '../../../contexts/BettingContext';
import { getCurrentUser, requireAuth } from '../../../lib/auth-helpers';
import Link from 'next/link';
import DepositButton from '../../../components/Wallet/DepositButton';

export default function WalletPage() {
  const router = useRouter();
  const { wallet, setWallet } = useBettingContext();
  const [depositAmount, setDepositAmount] = useState<string>('100.00');
  const [showSuccess, setShowSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/betting/wallet'));
      return;
    }
    setUser(currentUser);
    setIsLoading(false);

    // Fetch wallet from API (user-specific)
    const fetchWallet = async () => {
      try {
        const response = await fetch(`/api/betting/wallet?user_id=${currentUser.id}`);
        const data = await response.json();
        if (data.success && data.wallet) {
          setWallet(data.wallet);
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
      }
    };

    fetchWallet();
  }, [router, setWallet]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-gray-600">Manage your betting balance</p>
        </div>
        <Link
          href="/betting"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Betting
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2">Available Balance</p>
          <p className="text-3xl font-bold text-green-600">${wallet.balance.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2">Pending Bets</p>
          <p className="text-3xl font-bold text-yellow-600">${wallet.pending_bets.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-2">Total Won</p>
          <p className="text-3xl font-bold text-green-600">${wallet.total_won.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Deposit Funds</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (USD)
            </label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="1"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="100.00"
            />
          </div>

          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-600">
              Deposit successful! ${depositAmount} added to your balance.
            </div>
          )}

          {/* Option 1: Use Payment Link (no-code) - Recommended for MVP */}
          {(process.env.NEXT_PUBLIC_USE_PAYMENT_LINKS === 'true' || 
            process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_TEST) ? (
            <DepositButton
              amount={parseFloat(depositAmount) || 0}
              paymentLinkUrl={
                process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_DEPOSIT_CUSTOM || 
                process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_TEST ||
                'https://buy.stripe.com/test_eVq4gB5P89Nvb1X7RL5ZC00'
              }
              userId={user.id}
              amount={parseFloat(depositAmount) || 0}
              usePaymentLink={true}
            />
          ) : (
            // Option 2: Use API-based flow (Payment Intent)
            <>
              <button
                onClick={handleDeposit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg"
              >
                Deposit Funds
              </button>
              <p className="text-xs text-gray-500 text-center">
                Note: This is a demo. In production, this would integrate with Stripe Payment Links or Payment Intents.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Quick Deposit Amounts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[25, 50, 100, 250].map((amount) => {
            // Get Payment Link URL for this amount from env vars
            const paymentLinkKey = `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_DEPOSIT_${amount}`;
            const paymentLinkUrl = process.env[paymentLinkKey] as string | undefined;

            return (
              <DepositButton
                key={amount}
                amount={amount}
                paymentLinkUrl={paymentLinkUrl}
                usePaymentLink={!!paymentLinkUrl}
                userId={user.id}
              />
            );
          })}
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">
          {(process.env.NEXT_PUBLIC_USE_PAYMENT_LINKS === 'true' || 
            process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_TEST)
            ? 'Click to deposit via Stripe Payment Link (Test Mode)'
            : 'Click to set amount, then use Deposit Funds button above'}
        </p>
      </div>
    </div>
  );
}

