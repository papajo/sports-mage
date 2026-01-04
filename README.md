# SportsMage - Sports Betting Application

A full-featured sports betting application built with Next.js 14, TypeScript, and Tailwind CSS. Features real-time betting odds, bet placement, wallet management, and comprehensive bet history tracking.

## 🚀 Features

- **Real-time Betting Odds**: Display live betting odds for multiple sports
- **Bet Placement**: Place bets on moneyline, spread, and totals markets
- **Bet Slip**: Manage multiple bets before placing
- **Wallet System**: Track balance, deposits, and pending bets
- **Bet History**: View all placed bets with status tracking (Pending, Won, Lost)
- **Live Scores**: Real-time updates on ongoing matches
- **Multiple Sports**: Support for Football, Tennis, Cricket, and more
- **Responsive Design**: Modern UI built with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Database**: Cloudflare D1 (ready for integration)
- **Deployment**: Vercel/Netlify ready

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sports-mage.git
cd sports-mage

# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:3003`

## 🏗️ Project Structure

```
SportsMage/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── betting/           # Betting pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── BettingOdds.tsx   # Odds display
│   ├── BetSlip.tsx       # Bet slip component
│   └── ...
├── lib/                   # Shared utilities
│   ├── betting.ts        # Betting hook
│   └── ...
├── contexts/              # React contexts
│   └── BettingContext.tsx
└── ...
```

## 🎯 Key Pages

- `/` - Home page
- `/betting` - Main betting interface
- `/betting/history` - Bet history
- `/betting/wallet` - Wallet management
- `/live` - Live scores
- `/tennis-cricket` - Tennis & Cricket dashboard
- `/leagues` - Browse leagues
- `/teams` - Browse teams
- `/fixtures` - Upcoming matches

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# API Keys (when integrating live data)
API_SPORTS_KEY=your_api_key
SPORTRADAR_KEY=your_sportradar_key

# Database (when using Cloudflare D1)
DATABASE_URL=your_database_url
```

## 📚 Documentation

- [How-To Guide](./howto.md) - Development guide
- [Troubleshooting](./TROUBLESHOOTING.md) - Issue tracking and solutions
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Deploy to Vercel/Netlify
- [Betting App Guide](./BETTING_APP_GUIDE.md) - Betting features documentation
- [Live Data Sources](./LIVE_DATA_SOURCES_RESEARCH.md) - API research for betting data

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Vercel auto-detects Next.js settings
4. Add environment variables
5. Deploy!

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Deploy to Netlify

1. Push to GitHub
2. Import project in [Netlify](https://netlify.com)
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables
5. Deploy!

## 🧪 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📝 Scripts

- `npm run dev` - Start development server on port 3003
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Security Notes

- Never commit `.env` files
- Use environment variables for API keys
- Implement proper authentication for production
- Validate all user inputs
- Use HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🐛 Known Issues

- API routes currently return mock data (needs database integration)
- Authentication system not yet implemented
- Real-time odds updates need API integration

## 🗺️ Roadmap

- [ ] Integrate The Odds API for real betting odds
- [ ] Connect Cloudflare D1 database
- [ ] Implement user authentication
- [ ] Add WebSocket for real-time updates
- [ ] Implement bet settlement system
- [ ] Add payment processing

## 📞 Support

For issues and questions, please check:
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [How-To Guide](./howto.md)

---

Built with ❤️ using Next.js
