'use client';

import { useState, useEffect } from 'react';
import { Bet, BetStatus } from '../../../lib/betting';
import { useBettingContext } from '../../../contexts/BettingContext';
import Link from 'next/link';

export default function BetHistoryPage() {
  const { bets } = useBettingContext();
  const [filter, setFilter] = useState<BetStatus | 'all'>('all');

  const filteredBets = filter === 'all' 
    ? bets 
    : bets.filter(bet => bet.status === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: BetStatus) => {
    switch (status) {
      case 'won':
        return 'text-green-600 bg-green-50';
      case 'lost':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bet History</h1>
          <p className="text-gray-600">View all your placed bets</p>
        </div>
        <Link
          href="/betting"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Betting
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px">
          {(['all', 'pending', 'won', 'lost'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`py-4 px-6 font-medium text-sm capitalize ${
                filter === status
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {status === 'all' ? 'All Bets' : status}
              {status !== 'all' && (
                <span className="ml-2 text-xs">
                  ({bets.filter(b => b.status === status).length})
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {filteredBets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No bets found</p>
          <Link
            href="/betting"
            className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
          >
            Place your first bet →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBets.map((bet) => (
            <div key={bet.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{bet.selection}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bet.status)}`}>
                      {bet.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 capitalize">{bet.bet_type}</p>
                  <p className="text-xs text-gray-500 mt-1">Placed: {formatDate(bet.placed_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Stake</p>
                  <p className="font-bold">${bet.stake.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Odds</p>
                  <p className="font-semibold">{bet.odds > 0 ? '+' : ''}{bet.odds}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Potential Payout</p>
                  <p className="font-semibold text-green-600">${bet.potential_payout.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Profit</p>
                  <p className={`font-semibold ${
                    bet.status === 'won' ? 'text-green-600' : 
                    bet.status === 'lost' ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {bet.status === 'won' ? `+$${(bet.potential_payout - bet.stake).toFixed(2)}` :
                     bet.status === 'lost' ? `-$${bet.stake.toFixed(2)}` :
                     `+$${(bet.potential_payout - bet.stake).toFixed(2)}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

