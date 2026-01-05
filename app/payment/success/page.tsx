'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { getCurrentUser } from '../../../lib/auth-helpers';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  
  const sessionId = searchParams?.get('session_id');
  const paymentIntentId = searchParams?.get('payment_intent');
  const transactionId = sessionId || paymentIntentId;

  useEffect(() => {
    const processPayment = async () => {
      try {
        const user = getCurrentUser();
        if (!user) {
          setError('Please log in to complete your deposit');
          setIsProcessing(false);
          return;
        }

        // Get amount from URL params or metadata
        const urlAmount = searchParams?.get('amount');
        if (urlAmount) {
          setAmount(urlAmount);
        }

        // If we have a transaction ID, update wallet via API
        if (transactionId) {
          // Try to get amount from session/payment intent metadata
          // For now, we'll use the amount from URL or default to checking webhook
          const depositAmount = urlAmount ? parseFloat(urlAmount) : null;

          if (depositAmount && depositAmount > 0) {
            const response = await fetch('/api/betting/wallet', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id,
                action: 'deposit',
                amount: depositAmount,
                transactionId,
              }),
            });

            const data = await response.json();
            if (!data.success) {
              setError(data.error || 'Failed to update wallet');
            }
          }
        }

        setIsProcessing(false);
      } catch (err) {
        console.error('Error processing payment:', err);
        setError('An error occurred while processing your payment');
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [sessionId, paymentIntentId, transactionId, searchParams]);

  if (isProcessing) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        
        {error ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Received</h1>
            <p className="text-lg text-gray-600 mb-2">
              Your payment was successful, but there was an issue updating your wallet.
            </p>
            <p className="text-sm text-red-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500 mb-6">
              Please contact support with your transaction ID if the funds don't appear in your wallet.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-lg text-gray-600 mb-6">
              {amount 
                ? `$${parseFloat(amount).toFixed(2)} has been added to your wallet.`
                : 'Your payment has been processed successfully and your wallet has been updated.'}
            </p>
          </>
        )}
        
        {transactionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Transaction ID</p>
            <p className="text-lg font-mono font-semibold text-gray-900">{transactionId}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <Link
            href="/betting/wallet"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            View Wallet
          </Link>
          <div>
            <Link
              href="/betting"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Continue Betting →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
