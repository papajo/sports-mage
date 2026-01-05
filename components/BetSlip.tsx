'use client';

import React, { useState, useEffect } from 'react';
import { calculatePayout } from '../lib/betting';
import { useBettingContext } from '../contexts/BettingContext';

export default function BetSlipComponent() {
  const { betSlip, removeFromBetSlip, clearBetSlip, placeBet, wallet } = useBettingContext();
  const [stake, setStake] = useState<string>('10.00');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  // Debug: Log bet slip changes
  React.useEffect(() => {
    console.log('Bet slip updated:', betSlip);
  }, [betSlip]);

  const totalPotentialPayout = betSlip.reduce((sum, bet) => {
    const stakeAmount = parseFloat(stake) || 0;
    return sum + calculatePayout(stakeAmount / betSlip.length, bet.odds);
  }, 0);

  const handlePlaceBet = () => {
    const stakeAmount = parseFloat(stake);
    setError('');
    
    if (isNaN(stakeAmount) || stakeAmount <= 0) {
      setError('Please enter a valid stake amount');
      return;
    }

    if (wallet.balance < stakeAmount) {
      setError('Insufficient balance');
      return;
    }

    const result = placeBet(stakeAmount);
    
    if (result.success) {
      setShowSuccess(true);
      setStake('10.00');
      // Note: Bet slip is automatically cleared after successful bet placement
      // This is standard behavior - bets are saved to your bet history
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } else {
      setError(result.message);
    }
  };

  if (betSlip.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
        <h2 className="text-xl font-bold mb-4">Bet Slip</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Your bet slip is empty</p>
          <p className="text-sm mt-2">Click on odds to add bets</p>
          {/* Debug info */}
          <p className="text-xs text-gray-400 mt-4">Debug: betSlip.length = {betSlip.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Bet Slip</h2>
        <button
          onClick={clearBetSlip}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {betSlip.map((bet) => (
          <div key={bet.id} className="border rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="text-sm font-semibold">{bet.selection}</p>
                <p className="text-xs text-gray-600">{bet.home_team} vs {bet.away_team}</p>
                <p className="text-xs text-gray-500">{bet.league}</p>
              </div>
              <button
                onClick={() => removeFromBetSlip(bet.id)}
                className="text-red-600 hover:text-red-800 ml-2"
              >
                ×
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 capitalize">{bet.bet_type}</span>
              <span className="font-bold text-blue-600">{bet.formatted_odds}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span>Stake:</span>
          <input
            type="number"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            min="1"
            step="0.01"
            className="w-24 px-2 py-1 border rounded text-right"
            placeholder="10.00"
          />
        </div>
        <div className="flex justify-between font-bold">
          <span>Potential Payout:</span>
          <span className="text-green-600">${totalPotentialPayout.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Balance:</span>
          <span>${wallet.balance.toFixed(2)}</span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded p-2 text-sm text-green-600">
            <p className="font-semibold">✓ Bet placed successfully!</p>
            <p className="text-xs mt-1">Your bet slip has been cleared. View your bets in <a href="/betting/history" className="underline font-medium">Bet History</a>.</p>
          </div>
        )}

        <button
          onClick={handlePlaceBet}
          disabled={betSlip.length === 0 || parseFloat(stake) <= 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Place Bet
        </button>
      </div>
    </div>
  );
}

