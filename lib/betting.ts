'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Betting types
export type BetType = 'moneyline' | 'spread' | 'total' | 'props';
export type BetStatus = 'pending' | 'won' | 'lost' | 'cancelled';

export interface BettingOdds {
  id: string;
  home_team: string;
  away_team: string;
  league: string;
  start_time: string;
  moneyline: {
    home: number;
    away: number;
    draw?: number;
  };
  spread: {
    home: number;
    away: number;
    line: number;
  };
  total: {
    over: number;
    under: number;
    line: number;
  };
  last_updated: string;
}

export interface Bet {
  id: string;
  user_id: string;
  fixture_id: string;
  bet_type: BetType;
  selection: string;
  odds: number;
  stake: number;
  potential_payout: number;
  status: BetStatus;
  placed_at: string;
  settled_at?: string;
}

export interface UserWallet {
  balance: number;
  currency: string;
  pending_bets: number;
  total_won: number;
  total_lost: number;
}

// Mock betting odds data
export const getMockBettingOdds = (): BettingOdds[] => {
  return [
    {
      id: '1',
      home_team: 'Manchester United',
      away_team: 'Liverpool',
      league: 'Premier League',
      start_time: new Date(Date.now() + 3600000).toISOString(),
      moneyline: {
        home: -120,
        away: +150,
        draw: +280
      },
      spread: {
        home: -1.5,
        away: +1.5,
        line: 1.5
      },
      total: {
        over: -110,
        under: -110,
        line: 2.5
      },
      last_updated: new Date().toISOString()
    },
    {
      id: '2',
      home_team: 'Barcelona',
      away_team: 'Real Madrid',
      league: 'La Liga',
      start_time: new Date(Date.now() + 7200000).toISOString(),
      moneyline: {
        home: +130,
        away: -140,
        draw: +250
      },
      spread: {
        home: +0.5,
        away: -0.5,
        line: 0.5
      },
      total: {
        over: -105,
        under: -115,
        line: 3.0
      },
      last_updated: new Date().toISOString()
    },
    {
      id: '3',
      home_team: 'Lakers',
      away_team: 'Warriors',
      league: 'NBA',
      start_time: new Date(Date.now() + 10800000).toISOString(),
      moneyline: {
        home: -110,
        away: -110
      },
      spread: {
        home: -4.5,
        away: +4.5,
        line: 4.5
      },
      total: {
        over: -110,
        under: -110,
        line: 225.5
      },
      last_updated: new Date().toISOString()
    }
  ];
};

// Format American odds
export const formatAmericanOdds = (odds: number): string => {
  if (odds > 0) {
    return `+${odds}`;
  }
  return odds.toString();
};

// Calculate potential payout
export const calculatePayout = (stake: number, odds: number): number => {
  if (odds > 0) {
    return stake + (stake * odds / 100);
  } else {
    return stake + (stake * 100 / Math.abs(odds));
  }
};

// Convert American odds to decimal
export const americanToDecimal = (odds: number): number => {
  if (odds > 0) {
    return (odds / 100) + 1;
  } else {
    return (100 / Math.abs(odds)) + 1;
  }
};

// Helper to get initial bet slip from localStorage (client-side only)
function getInitialBetSlip(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('user_bet_slip');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Betting hook
export function useBetting() {
  // Always start with default values to prevent hydration mismatch
  // For betSlip, we'll restore from localStorage immediately on client to prevent Fast Refresh reset
  const [wallet, setWallet] = useState<UserWallet>({
    balance: 1000.00,
    currency: 'USD',
    pending_bets: 0,
    total_won: 0,
    total_lost: 0
  });
  const [bets, setBets] = useState<Bet[]>([]);
  // Initialize betSlip from localStorage immediately on client to survive Fast Refresh
  const [betSlip, setBetSlip] = useState<any[]>(getInitialBetSlip);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Use ref to track if we've initialized to prevent overwriting with empty values
  const initializedRef = useRef(false);

  // Load wallet and bets from localStorage after mount (client-side only)
  // betSlip is already initialized from localStorage in useState above
  useEffect(() => {
    if (initializedRef.current) return;
    
    // In production, fetch from API:
    // const fetchWallet = async () => {
    //   const response = await fetch('/api/betting/wallet?user_id=user-1');
    //   const data = await response.json();
    //   if (data.success) setWallet(data.wallet);
    // };
    // fetchWallet();
    
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      try {
        const savedWallet = localStorage.getItem('user_wallet');
        const savedBets = localStorage.getItem('user_bets');
        
        if (savedWallet) {
          const parsed = JSON.parse(savedWallet);
          setWallet(parsed);
        }
        
        if (savedBets) {
          const parsed = JSON.parse(savedBets);
          setBets(parsed);
        }
        
        initializedRef.current = true;
        setIsHydrated(true);
      } catch (e) {
        console.error('Error loading from localStorage:', e);
        setIsHydrated(true);
      }
    } else {
      setIsHydrated(true);
    }
  }, []);

  // Separate effect to restore betSlip if it gets reset (e.g., by Fast Refresh)
  // Only restore if betSlip is empty but localStorage has data
  useEffect(() => {
    if (typeof window === 'undefined' || !initializedRef.current) return;
    
    const savedBetSlip = localStorage.getItem('user_bet_slip');
    if (savedBetSlip && betSlip.length === 0) {
      try {
        const parsed = JSON.parse(savedBetSlip);
        if (parsed.length > 0) {
          console.log('Restoring bet slip from localStorage (was reset):', parsed.length, 'items');
          setBetSlip(parsed);
        }
      } catch (e) {
        console.error('Error restoring bet slip from localStorage:', e);
      }
    }
  }, [betSlip.length]);

  // Save wallet, bets, and bet slip to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_wallet', JSON.stringify(wallet));
    }
  }, [wallet]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_bets', JSON.stringify(bets));
    }
  }, [bets]);

  useEffect(() => {
    if (typeof window === 'undefined' || !initializedRef.current) return;
    
    // Don't save empty bet slip if we just initialized (might be Fast Refresh reset)
    // Only save if we have items or if we explicitly cleared it
    if (betSlip.length > 0) {
      localStorage.setItem('user_bet_slip', JSON.stringify(betSlip));
      console.log('Saved bet slip to localStorage:', betSlip.length, 'items');
    } else {
      // Only clear localStorage if bet slip was explicitly cleared (not just reset)
      // Check if localStorage has data - if it does and we're empty, it might be a reset
      const saved = localStorage.getItem('user_bet_slip');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // If localStorage has items but state is empty, don't overwrite (likely Fast Refresh reset)
          if (parsed.length > 0) {
            console.log('Bet slip reset detected, preserving localStorage data');
            return;
          }
        } catch (e) {
          // If parsing fails, it's safe to clear
        }
      }
      // Only clear if localStorage is also empty or invalid
      localStorage.setItem('user_bet_slip', JSON.stringify([]));
      console.log('Cleared bet slip from localStorage');
    }
  }, [betSlip]);

  const addToBetSlip = useCallback((odds: BettingOdds, betType: BetType, selection: string, oddsValue: number) => {
    console.log('addToBetSlip called with:', { oddsId: odds.id, betType, selection, oddsValue });
    
    setBetSlip(prev => {
      console.log('Previous bet slip length:', prev.length);
      console.log('Previous bet slip contents:', prev);
      
      // Check if this bet already exists to prevent duplicates
      const existingBet = prev.find(bet => 
        bet.fixture_id === odds.id && 
        bet.bet_type === betType && 
        bet.selection === selection
      );
      
      if (existingBet) {
        console.log('Bet already in slip, skipping');
        return prev;
      }
      
      const betItem = {
        id: `${odds.id}-${betType}-${Date.now()}`,
        fixture_id: odds.id,
        home_team: odds.home_team,
        away_team: odds.away_team,
        league: odds.league,
        bet_type: betType,
        selection,
        odds: oddsValue,
        formatted_odds: formatAmericanOdds(oddsValue)
      };
      
      const newSlip = [...prev, betItem];
      console.log('Adding to bet slip:', betItem);
      console.log('New bet slip length:', newSlip.length);
      console.log('New bet slip contents:', newSlip);
      console.log('State update queued, bet slip should persist');
      return newSlip;
    });
  }, []);

  const removeFromBetSlip = useCallback((id: string) => {
    setBetSlip(prev => prev.filter(bet => bet.id !== id));
  }, []);

  const clearBetSlip = useCallback(() => {
    setBetSlip([]);
  }, []);

  const placeBet = useCallback((stake: number): { success: boolean; message: string; bet?: Bet } => {
    if (betSlip.length === 0) {
      return { success: false, message: 'Bet slip is empty' };
    }

    if (stake <= 0) {
      return { success: false, message: 'Stake must be greater than 0' };
    }

    if (wallet.balance < stake) {
      return { success: false, message: 'Insufficient balance' };
    }

    // Create bets for each item in bet slip
    const newBets: Bet[] = betSlip.map((item, index) => ({
      id: `bet-${Date.now()}-${index}`,
      user_id: 'user-1', // In production, get from auth
      fixture_id: item.fixture_id,
      bet_type: item.bet_type,
      selection: item.selection,
      odds: item.odds,
      stake: stake / betSlip.length, // Divide stake across all bets
      potential_payout: calculatePayout(stake / betSlip.length, item.odds),
      status: 'pending',
      placed_at: new Date().toISOString()
    }));

    // Update wallet
    const totalStake = stake;
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - totalStake,
      pending_bets: prev.pending_bets + totalStake
    }));

    // Add bets
    setBets(prev => [...prev, ...newBets]);

    // Clear bet slip
    clearBetSlip();

    return { 
      success: true, 
      message: `Bet placed successfully! Total stake: $${totalStake.toFixed(2)}`,
      bet: newBets[0]
    };
  }, [betSlip, wallet, clearBetSlip]);

  return {
    wallet,
    bets,
    betSlip,
    addToBetSlip,
    removeFromBetSlip,
    clearBetSlip,
    placeBet,
    setWallet,
    setBets,
    isHydrated
  };
}

