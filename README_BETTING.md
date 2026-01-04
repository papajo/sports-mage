# SportsMage - Sports Betting Application

## 🎰 What is SportsMage?

SportsMage is a **full-featured sports betting application** that allows users to:
- View real-time betting odds for live and upcoming matches
- Place bets on multiple markets (Moneyline, Spread, Totals)
- Manage their betting wallet and balance
- Track bet history and winnings
- View live scores and sports data

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3003`

## 📱 Main Features

### Betting Page (`/betting`)
- View available betting odds
- Click on odds to add to bet slip
- Multiple betting markets per match
- Real-time odds updates

### Bet Slip
- Add multiple bets
- Set stake amount
- Calculate potential payouts
- Place bets with balance validation

### Wallet (`/betting/wallet`)
- View current balance
- Deposit funds
- Track pending bets
- View total winnings/losses

### Bet History (`/betting/history`)
- View all placed bets
- Filter by status
- Track profit/loss
- See bet details

## 🎯 How to Use

### Placing a Bet

1. Navigate to `/betting`
2. Browse available matches and odds
3. Click on any odds button to add to bet slip
4. Select betting market (Moneyline, Spread, or Total)
5. Set your stake amount in the bet slip
6. Click "Place Bet"
7. Your balance will be deducted and bet will appear in history

### Managing Your Wallet

1. Navigate to `/betting/wallet`
2. Enter deposit amount
3. Click "Deposit Funds"
4. Balance updates immediately

### Viewing Bet History

1. Navigate to `/betting/history`
2. View all your bets
3. Filter by status (All, Pending, Won, Lost)
4. See detailed information for each bet

## 🔧 Integration with Real APIs

Currently, the app uses mock data. To integrate real betting odds:

1. **Get The Odds API Key**
   - Sign up at https://the-odds-api.com
   - Add key to `.env.local`: `ODDS_API_KEY=your_key`

2. **Update API Route**
   - Edit `app/api/betting/odds/route.ts`
   - Replace mock data with API call
   - See `BETTING_APP_GUIDE.md` for detailed instructions

3. **Set Up Database**
   - Create bets and wallet tables
   - See `BETTING_APP_GUIDE.md` for schema

## 📚 Documentation

- **BETTING_APP_GUIDE.md** - Complete betting app implementation guide
- **LIVE_DATA_SOURCES_RESEARCH.md** - Research on live data APIs
- **howto.md** - Development journal
- **tasks.md** - Task tracking

## 🎲 Betting Markets Explained

### Moneyline
- Bet on which team will win
- Example: Manchester United (-120) vs Liverpool (+150)
- Negative odds = favorite, positive = underdog

### Spread
- Bet on point difference
- Example: Lakers -4.5 vs Warriors +4.5
- Lakers must win by 5+ points to win the bet

### Totals (Over/Under)
- Bet on total points/goals
- Example: Over 2.5 (-110) vs Under 2.5 (-110)
- Bet on whether total will be over or under the line

## 💰 Wallet System

- **Starting Balance**: $1,000.00 (demo mode)
- **Deposits**: Add funds to your wallet
- **Betting**: Balance deducted when placing bets
- **Payouts**: Winnings added to balance (when bets are settled)

## ⚠️ Current Limitations (Demo Mode)

- Uses localStorage (not persistent across devices)
- Mock odds data (not real-time from API)
- No bet settlement (bets remain pending)
- No payment processing (deposits are simulated)
- No authentication (single user demo)

## 🔐 Production Requirements

Before going live, you need:
- Real betting odds API integration
- Database for bets and wallet
- Payment processing (Stripe/PayPal)
- User authentication
- Bet settlement system
- Security measures
- Compliance features (responsible gambling)

## 📞 Support

For implementation questions, see:
- `BETTING_APP_GUIDE.md` - Implementation guide
- `LIVE_DATA_SOURCES_RESEARCH.md` - API research

