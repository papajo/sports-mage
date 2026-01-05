'use client';

import { useState } from 'react';

interface DepositButtonProps {
  amount: number;
  paymentLinkUrl?: string; // Payment Link URL from Stripe Dashboard (no-code)
  usePaymentLink?: boolean; // Use Payment Link or API-based flow
}

export default function DepositButton({ 
  amount, 
  paymentLinkUrl,
  usePaymentLink = true 
}: DepositButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = async () => {
    if (usePaymentLink && paymentLinkUrl) {
      // Use Payment Link (no-code) - redirect to Stripe-hosted page
      // The Payment Link will handle the payment and redirect back to success URL
      window.location.href = paymentLinkUrl;
      return;
    }

    // Use API-based flow (Payment Intent)
    setIsLoading(true);
    try {
      // Get user ID from localStorage or context
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id || 'demo-user';

      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'usd',
          userId,
        }),
      });

      const data = await response.json();

      if (data.success && data.clientSecret) {
        // In production, redirect to Stripe Checkout or use Stripe Elements
        // For now, show success message
        alert(`Payment intent created. In production, this would redirect to Stripe Checkout.`);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      alert('Failed to process deposit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDeposit}
      disabled={isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? 'Processing...' : `Deposit $${amount.toFixed(2)}`}
    </button>
  );
}

