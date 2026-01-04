# How-To Guide - SportsMage Development Journal

## Project Overview
SportsMage is a **full-featured sports betting application** built with Next.js. The application includes:
- Real-time betting odds display
- Bet placement and management
- Wallet system with balance tracking
- Bet history and tracking
- Live scores and sports data
- Multiple betting markets (Moneyline, Spread, Totals)

**Note**: This has been transformed from a simple live scores hub into a complete betting platform.

## Development Setup

### Initial Setup (Completed)
1. **Created package.json** with Next.js 14 dependencies
2. **Set up TypeScript configuration** (tsconfig.json)
3. **Configured Next.js** (next.config.js)
4. **Set up Tailwind CSS** (tailwind.config.js, postcss.config.js)
5. **Created proper directory structure**:
   - `app/` - Next.js 13+ app directory with pages and API routes
   - `components/` - React components
   - `lib/` - Shared utilities and hooks

### Project Structure
```
SportsMage/
├── app/
│   ├── api/              # API routes
│   │   ├── search/
│   │   ├── payments/
│   │   ├── tennis/
│   │   └── cricket/
│   ├── search/           # Search page
│   ├── tennis-cricket/   # Tennis & Cricket dashboard
│   ├── payment/          # Payment/subscription page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── Search.tsx
│   ├── Chatbot.tsx
│   ├── TennisCricketDashboard.tsx
│   └── PaymentTesting.tsx
├── lib/                  # Shared utilities
│   ├── chatbot.ts        # Chatbot hook
│   └── payment.ts        # Payment form hook
└── database.ts           # Database service (Cloudflare D1)

```

## Running the Application

### Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3003`

**Note:** The application is configured to run on port 3003 to avoid conflicts with other applications.

### Build for Production
```bash
npm run build
npm start
```

## Key Features

### 1. Sports Betting ⭐ PRIMARY FEATURE
- Located at `/betting`
- Real-time betting odds display
- Multiple betting markets:
  - **Moneyline**: Win/loss/draw bets
  - **Spread**: Point spread betting
  - **Totals**: Over/under betting
- Bet slip functionality
- Click-to-bet interface
- API endpoint: `/api/betting/odds`

### 2. Bet Management
- **Bet Slip**: Add multiple bets, set stake, place bets
- **Bet History**: Located at `/betting/history`
  - View all placed bets
  - Filter by status (Pending, Won, Lost)
  - Track profit/loss
- **Wallet**: Located at `/betting/wallet`
  - View balance
  - Deposit funds
  - Track pending bets

### 3. Live Scores
- Located at `/live`
- Real-time updates on ongoing matches
- Displays live scores with match status

### 4. Search Functionality
- Located at `/search`
- Searches across leagues, teams, and fixtures
- API endpoint: `/api/search?q=<query>`

### 5. Sports Data Pages
- **Leagues**: `/leagues` - View all leagues
- **Teams**: `/teams` - Browse teams
- **Fixtures**: `/fixtures` - Upcoming matches
- **Tennis & Cricket**: `/tennis-cricket` - Specialized coverage

## API Integration Status

### API-Sports Integration
- Database schema ready
- Python scripts available for data fetching
- Web UI ready to consume data

### SportRadar Integration
- Schema defined
- Placeholder API routes created
- Needs actual API key and implementation

## Database

### Cloudflare D1 Database
- Schema defined in `0001_initial.sql`
- DatabaseService class in `database.ts`
- Currently using placeholder implementations in API routes

## Common Tasks

### Adding a New Page
1. Create a new directory in `app/` (e.g., `app/new-page/`)
2. Add `page.tsx` with the page component
3. Add route to navigation in `app/layout.tsx` if needed

### Adding a New API Route
1. Create directory in `app/api/` (e.g., `app/api/new-endpoint/`)
2. Add `route.ts` with GET/POST handlers
3. Use NextRequest/NextResponse for handling requests

### Adding a New Component
1. Create component in `components/` directory
2. Export as default or named export
3. Import in pages where needed

## Troubleshooting

### Build Errors
- Check TypeScript errors: `npm run build`
- Ensure all imports are correct
- Verify file paths match Next.js app directory structure

### Runtime Errors
- Check browser console for client-side errors
- Check terminal for server-side errors
- Verify API routes are returning correct data format

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check that `globals.css` is imported in `layout.tsx`
- Verify Tailwind classes are being used correctly

## Next Steps

1. **Database Integration**: Connect Cloudflare D1 database to API routes
2. **API Integration**: Implement actual API calls to API-Sports and SportRadar
3. **Authentication**: Add user authentication system
4. **Data Fetching**: Set up scheduled jobs for updating sports data
5. **Error Handling**: Improve error handling and user feedback
6. **Testing**: Add unit and integration tests

## Live Data Sources for Betting Applications

For betting applications, live data is critical. See `LIVE_DATA_SOURCES_RESEARCH.md` for comprehensive research on:

- **The Odds API**: Recommended for betting odds (primary source)
- **SportRadar**: Enterprise solution for official data
- **API-Sports**: Current integration (good for scores, needs odds supplement)
- **SportAPI.ai**: Real-time WebSocket support
- **Other providers**: Multiple options with different specializations

**Key Requirements for Betting Apps:**
- Real-time updates (sub-second latency)
- Betting odds integration
- Live statistics for in-play betting
- WebSocket support for push updates
- 99.9%+ uptime SLA

**Recommended Starting Point:**
- The Odds API for betting odds
- API-Sports for live scores (already integrated)
- Implement WebSocket polling for real-time updates

## Notes

- The application uses Next.js 14 with the App Router
- TypeScript is configured for type safety
- Tailwind CSS is used for styling
- Components are organized in a modular structure
- API routes follow Next.js 13+ conventions

## Current Status

✅ **Application is running successfully**
- All core files are in place
- No linter errors
- Development server is running
- All pages and components are properly structured
- API routes are created (placeholder implementations)

⚠️ **Next Steps for Full Functionality:**
- Connect Cloudflare D1 database to API routes
- Integrate actual API calls to API-Sports and SportRadar
- Add authentication system
- Implement real data fetching

