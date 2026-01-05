'use client';

import { useState, useEffect } from 'react';
import BettingOddsComponent from '../../components/BettingOdds';
import BetSlipComponent from '../../components/BetSlip';
import { getMockBettingOdds, BettingOdds } from '../../lib/betting';
import { useBettingContext } from '../../contexts/BettingContext';
import Link from 'next/link';

export default function BettingPage() {
  const [odds, setOdds] = useState<BettingOdds[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { wallet } = useBettingContext();

  useEffect(() => {
    const fetchOdds = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/betting/odds');
        const data = await response.json();
        
        if (data.success && data.odds) {
          setOdds(data.odds);
        } else {
          // Fallback to mock data
          setOdds(getMockBettingOdds());
        }
      } catch (error) {
        console.error('Error fetching odds:', error);
        // Fallback to mock data
        setOdds(getMockBettingOdds());
      } finally {
        setIsLoading(false);
      }
    };

    fetchOdds();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchOdds, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sports Betting</h1>
          <p className="text-gray-600">Place bets on live and upcoming matches</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Balance</div>
          <div className="text-2xl font-bold text-green-600">${wallet.balance.toFixed(2)}</div>
          <Link href="/betting/wallet" className="text-sm text-blue-600 hover:text-blue-800">
            Manage Wallet →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-500">Loading betting odds...</p>
            </div>
          ) : odds.length > 0 ? (
            <div>
              <h2 className="text-xl font-bold mb-4">Available Bets</h2>
              {odds.map((odd) => (
                <BettingOddsComponent key={odd.id} odds={odd} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No betting odds available at the moment</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <BetSlipComponent />
        </div>
      </div>
    </div>
  );
}

