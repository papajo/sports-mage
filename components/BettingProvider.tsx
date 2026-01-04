'use client';

import React, { ReactNode } from 'react';
import { BettingProvider as Provider } from '../contexts/BettingContext';

export default function BettingProvider({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>;
}

