# Sports Betting App - Implementation Guide

## Overview

This application has been transformed from a simple live scores hub into a **full-featured sports betting application**. The app now includes:

- Real-time betting odds display
- Bet slip functionality
- Wallet management
- Bet history tracking
- Multiple betting markets (Moneyline, Spread, Totals)
- User balance management

## Current Features

### ✅ Implemented Features

1. **Betting Odds Display** (`/betting`)
   - Live and upcoming matches with odds
   - Multiple betting markets:
     - **Moneyline**: Win/loss/draw bets
     - **Spread**: Point spread betting
     - **Totals**: Over/under betting
   - Real-time odds updates (polling every 30 seconds)
   - Click-to-bet functionality

2. **Bet Slip** (Sidebar component)
   - Add multiple bets
   - Calculate potential payouts
   - Set stake amount
   - Place bets with balance validation
   - Clear bet slip

3. **Wallet Management** (`/betting/wallet`)
   - View current balance
   - Deposit funds
   - View pending bets amount
   - Track total winnings/losses
   - Quick deposit buttons

4. **Bet History** (`/betting/history`)
   - View all placed bets
   - Filter by status (All, Pending, Won, Lost)
   - See stake, odds, and potential payout
   - Track profit/loss

5. **User Balance System**
   - Starting balance: $1,000.00
   - Automatic balance deduction on bet placement
   - Balance validation before placing bets
   - LocalStorage persistence (demo mode)

## Architecture

### Components Structure

```
components/
├── BettingOdds.tsx      # Display odds for each match
├── BetSlip.tsx          # Bet slip sidebar
└── ...

lib/
└── betting.ts           # Betting logic, hooks, utilities

app/
├── betting/
│   ├── page.tsx        # Main betting page
│   ├── history/
│   │   └── page.tsx    # Bet history
│   └── wallet/
│       └── page.tsx    # Wallet management
└── api/
    └── betting/
        ├── odds/       # Get betting odds
        ├── place/      # Place bets
        └── wallet/     # Wallet operations
```

### Data Flow

```
User clicks odds
    ↓
Add to bet slip (local state)
    ↓
User sets stake
    ↓
Place bet → API call
    ↓
Update wallet balance
    ↓
Save bet to history
```

## Integration with Real Betting APIs

### Step 1: Get The Odds API Key

1. Sign up at https://the-odds-api.com
2. Get your API key
3. Add to `.env.local`:
   ```
   ODDS_API_KEY=your_api_key_here
   ```

### Step 2: Update API Route

Edit `app/api/betting/odds/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const API_KEY = process.env.ODDS_API_KEY;
    
    // Fetch odds for multiple sports
    const sports = ['soccer_epl', 'basketball_nba', 'americanfootball_nfl'];
    const allOdds = [];
    
    for (const sport of sports) {
      const response = await fetch(
        `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${API_KEY}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`
      );
      const data = await response.json();
      allOdds.push(...data);
    }
    
    return NextResponse.json({
      success: true,
      odds: allOdds,
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching odds:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch odds' },
      { status: 500 }
    );
  }
}
```

### Step 3: Transform API Response

The Odds API returns data in a different format. Create a transformer:

```typescript
// lib/oddsTransformer.ts
export function transformOddsAPIResponse(apiData: any): BettingOdds {
  return {
    id: apiData.id,
    home_team: apiData.home_team,
    away_team: apiData.away_team,
    league: apiData.sport_title,
    start_time: apiData.commence_time,
    moneyline: {
      home: apiData.bookmakers[0]?.markets.find((m: any) => m.key === 'h2h')?.outcomes.find((o: any) => o.name === apiData.home_team)?.price || 0,
      away: apiData.bookmakers[0]?.markets.find((m: any) => m.key === 'h2h')?.outcomes.find((o: any) => o.name === apiData.away_team)?.price || 0,
    },
    spread: {
      home: apiData.bookmakers[0]?.markets.find((m: any) => m.key === 'spreads')?.outcomes.find((o: any) => o.name === apiData.home_team)?.point || 0,
      away: apiData.bookmakers[0]?.markets.find((m: any) => m.key === 'spreads')?.outcomes.find((o: any) => o.name === apiData.away_team)?.point || 0,
      line: apiData.bookmakers[0]?.markets.find((m: any) => m.key === 'spreads')?.outcomes[0]?.point || 0,
    },
    },
    total: {
      over: apiData.bookmakers[0]?.markets.find((m: any) => m.key === 'totals')?.outcomes.find((o: any) => o.name === 'Over')?.price || 0,
      under: apiData.bookmakers[0]?.markets.find((m: any) => m.key === 'totals')?.outcomes.find((o: any) => o.name === 'Under')?.price || 0,
      line: apiData.bookmakers[0]?.markets.find((m: any) => m.key === 'totals')?.outcomes[0]?.point || 0,
    },
    last_updated: new Date().toISOString()
  };
}
```

### Step 4: Implement WebSocket for Real-Time Updates

For real-time odds updates, use WebSocket:

```typescript
// lib/oddsWebSocket.ts
export function connectOddsWebSocket(onUpdate: (odds: BettingOdds) => void) {
  // In production, connect to your WebSocket server
  // which polls The Odds API and pushes updates
  
  const ws = new WebSocket('wss://your-api.com/odds');
  
  ws.onmessage = (event) => {
    const updatedOdds = JSON.parse(event.data);
    onUpdate(updatedOdds);
  };
  
  return ws;
}
```

## Database Schema for Betting

You'll need to add these tables to your database:

```sql
-- Bets table
CREATE TABLE bets (
  bet_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  fixture_id TEXT NOT NULL,
  bet_type TEXT NOT NULL, -- 'moneyline', 'spread', 'total'
  selection TEXT NOT NULL,
  odds REAL NOT NULL,
  stake REAL NOT NULL,
  potential_payout REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'won', 'lost', 'cancelled'
  placed_at TEXT NOT NULL,
  settled_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Wallet transactions
CREATE TABLE wallet_transactions (
  transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'deposit', 'withdrawal', 'bet', 'payout'
  amount REAL NOT NULL,
  balance_before REAL NOT NULL,
  balance_after REAL NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Update users table
ALTER TABLE users ADD COLUMN wallet_balance REAL DEFAULT 0.00;
```

## Next Steps for Production

### 1. Payment Integration
- Integrate Stripe or PayPal for deposits
- Implement withdrawal functionality
- Add payment history

### 2. Bet Settlement
- Create automated bet settlement system
- Integrate with live score APIs to determine winners
- Update wallet balances automatically

### 3. Real-Time Updates
- Implement WebSocket server
- Push odds updates to clients
- Update live scores in real-time

### 4. Security
- Add authentication/authorization
- Implement rate limiting
- Add bet validation
- Secure wallet operations

### 5. Compliance
- Add responsible gambling features
- Implement betting limits
- Add age verification
- Terms and conditions

## Testing the Betting App

1. **Navigate to `/betting`**
   - You should see available betting odds
   - Click on any odds to add to bet slip

2. **Add bets to slip**
   - Click multiple odds from different matches
   - Check bet slip updates

3. **Place a bet**
   - Set stake amount
   - Click "Place Bet"
   - Check balance updates
   - View bet in history

4. **Check wallet**
   - Navigate to `/betting/wallet`
   - Deposit funds
   - Check balance updates

5. **View bet history**
   - Navigate to `/betting/history`
   - See all placed bets
   - Filter by status

## Current Limitations (Demo Mode)

- Uses localStorage for persistence (not persistent across devices)
- Mock odds data (not real-time from API)
- No bet settlement (bets remain pending)
- No payment processing (deposits are simulated)
- No authentication (single user demo)

## Production Checklist

- [ ] Integrate The Odds API
- [ ] Set up database for bets and wallet
- [ ] Implement payment processing (Stripe/PayPal)
- [ ] Add user authentication
- [ ] Create bet settlement system
- [ ] Implement WebSocket for real-time updates
- [ ] Add security measures
- [ ] Implement responsible gambling features
- [ ] Add compliance features
- [ ] Set up monitoring and logging

## Support

For questions about integrating real betting APIs, refer to:
- `LIVE_DATA_SOURCES_RESEARCH.md` - Research on data sources
- `howto.md` - Development guide
- `tasks.md` - Task tracking

