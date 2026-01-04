'use client';

import { useState } from 'react';
import { useBettingContext } from '../../../contexts/BettingContext';
import Link from 'next/link';

export default function WalletPage() {
  const { wallet, setWallet } = useBettingContext();
  const [depositAmount, setDepositAmount] = useState<string>('100.00');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    setWallet(prev => ({
      ...prev,
      balance: prev.balance + amount
    }));

    setShowSuccess(true);
    setDepositAmount('100.00');
    setTimeout(() => setShowSuccess(false), 3000);
  };

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

          <button
            onClick={handleDeposit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg"
          >
            Deposit Funds
          </button>

          <p className="text-xs text-gray-500 text-center">
            Note: This is a demo. In production, this would integrate with a payment processor.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Quick Deposit Amounts</h2>
        <div className="grid grid-cols-4 gap-3">
          {[25, 50, 100, 250].map((amount) => (
            <button
              key={amount}
              onClick={() => setDepositAmount(amount.toFixed(2))}
              className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg py-3 px-4 font-medium transition-colors"
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

