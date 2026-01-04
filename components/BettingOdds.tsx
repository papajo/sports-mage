'use client';

import { useState } from 'react';
import { BettingOdds, formatAmericanOdds } from '../lib/betting';
import { useBettingContext } from '../contexts/BettingContext';

interface BettingOddsProps {
  odds: BettingOdds;
}

export default function BettingOddsComponent({ odds }: BettingOddsProps) {
  const { addToBetSlip, betSlip } = useBettingContext();
  const [activeTab, setActiveTab] = useState<'moneyline' | 'spread' | 'total'>('moneyline');
  const [showAdded, setShowAdded] = useState<string | null>(null);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleBetClick = (betType: 'moneyline' | 'spread' | 'total', selection: string, oddsValue: number) => {
    addToBetSlip(odds, betType, selection, oddsValue);
    
    // Show visual feedback - use a unique key for this specific bet
    const feedbackKey = `${odds.id}-${betType}-${selection}`;
    setShowAdded(feedbackKey);
    setTimeout(() => setShowAdded(null), 2000);
    
    // Debug log
    console.log('Bet added to slip:', { betType, selection, oddsValue, oddsId: odds.id });
    console.log('Current bet slip length before add:', betSlip.length);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold">{odds.league}</h3>
          <p className="text-sm text-gray-600">{formatTime(odds.start_time)}</p>
        </div>
        <div className="text-xs text-gray-500">
          Updated: {new Date(odds.last_updated).toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="font-semibold text-sm mb-1">{odds.home_team}</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-sm mb-1">{odds.away_team}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('moneyline')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'moneyline'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Moneyline
          </button>
          <button
            onClick={() => setActiveTab('spread')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'spread'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Spread
          </button>
          <button
            onClick={() => setActiveTab('total')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'total'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Total
          </button>
        </nav>
      </div>

      {/* Moneyline */}
      {activeTab === 'moneyline' && (
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleBetClick('moneyline', odds.home_team, odds.moneyline.home)}
            className={`bg-blue-50 hover:bg-blue-100 border-2 rounded-lg p-3 text-center transition-colors ${
              showAdded === `${odds.id}-moneyline-${odds.home_team}` ? 'border-green-500 bg-green-50' : 'border-blue-200'
            }`}
          >
            <p className="text-xs text-gray-600 mb-1">Home</p>
            <p className="font-bold text-blue-600">{formatAmericanOdds(odds.moneyline.home)}</p>
            {showAdded === `${odds.id}-moneyline-${odds.home_team}` && (
              <p className="text-xs text-green-600 mt-1">✓ Added</p>
            )}
          </button>
          {odds.moneyline.draw && (
            <button
              onClick={() => handleBetClick('moneyline', 'Draw', odds.moneyline.draw!)}
              className={`bg-gray-50 hover:bg-gray-100 border-2 rounded-lg p-3 text-center transition-colors ${
                showAdded === `${odds.id}-moneyline-Draw` ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
            >
              <p className="text-xs text-gray-600 mb-1">Draw</p>
              <p className="font-bold text-gray-700">{formatAmericanOdds(odds.moneyline.draw)}</p>
              {showAdded === `${odds.id}-moneyline-Draw` && (
                <p className="text-xs text-green-600 mt-1">✓ Added</p>
              )}
            </button>
          )}
          <button
            onClick={() => handleBetClick('moneyline', odds.away_team, odds.moneyline.away)}
            className={`bg-blue-50 hover:bg-blue-100 border-2 rounded-lg p-3 text-center transition-colors ${
              showAdded === `${odds.id}-moneyline-${odds.away_team}` ? 'border-green-500 bg-green-50' : 'border-blue-200'
            }`}
          >
            <p className="text-xs text-gray-600 mb-1">Away</p>
            <p className="font-bold text-blue-600">{formatAmericanOdds(odds.moneyline.away)}</p>
            {showAdded === `${odds.id}-moneyline-${odds.away_team}` && (
              <p className="text-xs text-green-600 mt-1">✓ Added</p>
            )}
          </button>
        </div>
      )}

      {/* Spread */}
      {activeTab === 'spread' && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleBetClick('spread', `${odds.home_team} ${odds.spread.home > 0 ? '+' : ''}${odds.spread.home}`, odds.spread.home)}
            className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg p-3 text-center transition-colors"
          >
            <p className="text-xs text-gray-600 mb-1">{odds.home_team}</p>
            <p className="font-bold text-blue-600">{odds.spread.home > 0 ? '+' : ''}{odds.spread.home}</p>
            <p className="text-xs text-gray-500 mt-1">Line: {odds.spread.line}</p>
          </button>
          <button
            onClick={() => handleBetClick('spread', `${odds.away_team} ${odds.spread.away > 0 ? '+' : ''}${odds.spread.away}`, odds.spread.away)}
            className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg p-3 text-center transition-colors"
          >
            <p className="text-xs text-gray-600 mb-1">{odds.away_team}</p>
            <p className="font-bold text-blue-600">{odds.spread.away > 0 ? '+' : ''}{odds.spread.away}</p>
            <p className="text-xs text-gray-500 mt-1">Line: {odds.spread.line}</p>
          </button>
        </div>
      )}

      {/* Total */}
      {activeTab === 'total' && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleBetClick('total', `Over ${odds.total.line}`, odds.total.over)}
            className="bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg p-3 text-center transition-colors"
          >
            <p className="text-xs text-gray-600 mb-1">Over</p>
            <p className="font-bold text-green-600">{formatAmericanOdds(odds.total.over)}</p>
            <p className="text-xs text-gray-500 mt-1">{odds.total.line}</p>
          </button>
          <button
            onClick={() => handleBetClick('total', `Under ${odds.total.line}`, odds.total.under)}
            className="bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-lg p-3 text-center transition-colors"
          >
            <p className="text-xs text-gray-600 mb-1">Under</p>
            <p className="font-bold text-red-600">{formatAmericanOdds(odds.total.under)}</p>
            <p className="text-xs text-gray-500 mt-1">{odds.total.line}</p>
          </button>
        </div>
      )}
    </div>
  );
}

