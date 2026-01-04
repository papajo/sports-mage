'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useBetting, UserWallet, Bet, BettingOdds, BetType } from '../lib/betting';

interface BettingContextType {
  wallet: UserWallet;
  bets: Bet[];
  betSlip: any[];
  addToBetSlip: (odds: BettingOdds, betType: BetType, selection: string, oddsValue: number) => void;
  removeFromBetSlip: (id: string) => void;
  clearBetSlip: () => void;
  placeBet: (stake: number) => { success: boolean; message: string; bet?: Bet };
  setWallet: React.Dispatch<React.SetStateAction<UserWallet>>;
  setBets: React.Dispatch<React.SetStateAction<Bet[]>>;
  isHydrated: boolean;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export function BettingProvider({ children }: { children: ReactNode }) {
  const betting = useBetting();

  // Don't memoize - the useCallback in useBetting already handles function stability
  // Memoizing here with object dependencies causes issues with state updates
  return (
    <BettingContext.Provider value={betting}>
      {children}
    </BettingContext.Provider>
  );
}

export function useBettingContext() {
  const context = useContext(BettingContext);
  if (context === undefined) {
    throw new Error('useBettingContext must be used within a BettingProvider');
  }
  return context;
}
