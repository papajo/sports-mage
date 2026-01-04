# Troubleshooting Journal

This document tracks issues, debugging steps, and solutions encountered during development.

## Current Session: 2025-01-XX

| Date/Time | Issue | Symptoms | Root Cause | Solution | Status |
|-----------|-------|----------|------------|----------|--------|
| 2025-01-XX | Bet Slip Always Empty | Bet slip shows "Debug: betSlip.length = 0" even after clicking odds | Context provider not properly wrapping components, syntax error in `addToBetSlip` function (missing `=>`) | Fixed syntax error, ensured proper context provider chain, added visual feedback | ✅ Resolved |
| 2025-01-XX | Bet Slip Resets on Fast Refresh | Bet slip gets reset to empty array when Fast Refresh triggers in development | Fast Refresh resets component state, and save effect was overwriting localStorage with empty array | Initialize betSlip from localStorage in useState, prevent saving empty arrays during reset, add restoration effect | ✅ Resolved |
| 2025-01-XX | Hydration Mismatch Error | "Text content does not match server-rendered HTML" - Server: "1000.00" Client: "960.00" | State initialized from localStorage synchronously causing server/client mismatch | Always initialize with default values, load from localStorage in useEffect after mount | ✅ Resolved |
| 2025-01-XX | useBettingContext Error | "useBettingContext must be used within a BettingProvider" | Context provider not properly set up in the component tree | Created Providers component, ensured proper client component boundaries | ✅ Resolved |
| 2025-01-XX | Tennis & Cricket Missing | Tennis and Cricket navigation link disappeared from header | Link was removed during layout updates | Added "Tennis & Cricket" link back to navigation menu | ✅ Resolved |

## Key Learnings

### React Context & State Management
- **Issue**: Context providers need to be client components when using hooks
- **Solution**: Use separate `Providers` component wrapper for client-side providers
- **Best Practice**: Initialize state with defaults, load from localStorage in `useEffect` to prevent hydration mismatches

### Fast Refresh & State Persistence
- **Issue**: Fast Refresh in Next.js development resets component state
- **Solution**: 
  - Initialize state from localStorage synchronously (client-side only)
  - Prevent save effects from overwriting localStorage during resets
  - Add restoration effects to recover from Fast Refresh resets
- **Best Practice**: Always check if localStorage has data before overwriting with empty state

### Next.js Hydration
- **Issue**: Server-rendered HTML doesn't match client-rendered HTML
- **Solution**: 
  - Always use same initial values on server and client
  - Load dynamic data (localStorage, etc.) in `useEffect` after mount
  - Use `isHydrated` flag to track when client-side data is loaded
- **Best Practice**: Never access `window` or `localStorage` during initial render on server

### State Update Patterns
- **Issue**: State updates not persisting through re-renders
- **Solution**: 
  - Use `useCallback` for functions passed through context
  - Avoid memoizing context values with object dependencies
  - Use functional updates (`prev => ...`) for state updates
- **Best Practice**: Keep context values stable, use refs to track initialization state

## Common Patterns

### Preventing Fast Refresh Resets
```typescript
// Initialize from localStorage synchronously (client-only)
const [betSlip, setBetSlip] = useState<any[]>(() => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('user_bet_slip');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});

// Prevent overwriting localStorage during resets
useEffect(() => {
  if (typeof window === 'undefined' || !initializedRef.current) return;
  
  if (betSlip.length > 0) {
    localStorage.setItem('user_bet_slip', JSON.stringify(betSlip));
  } else {
    // Check if localStorage has data - don't overwrite during reset
    const saved = localStorage.getItem('user_bet_slip');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        // Likely a Fast Refresh reset, preserve localStorage
        return;
      }
    }
    localStorage.setItem('user_bet_slip', JSON.stringify([]));
  }
}, [betSlip]);
```

### Context Provider Setup
```typescript
// app/providers.tsx (client component)
'use client';
import { ReactNode } from 'react';
import BettingProvider from '../components/BettingProvider';

export function Providers({ children }: { children: ReactNode }) {
  return <BettingProvider>{children}</BettingProvider>;
}

// app/layout.tsx (server component)
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Notes

- Fast Refresh in Next.js development can reset component state
- Always initialize state consistently between server and client
- Use localStorage for persistence, but load it after mount to prevent hydration errors
- Context providers must be client components when using hooks
- Use refs to track initialization state and prevent unnecessary re-initializations

