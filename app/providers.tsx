'use client';

import { ReactNode } from 'react';
import BettingProvider from '../components/BettingProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <BettingProvider>
      {children}
    </BettingProvider>
  );
}

