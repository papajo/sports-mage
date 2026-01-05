import { NextResponse } from 'next/server';
import { fetchOddsFromAPI, transformOddsApiResponse } from '../../../../lib/odds-api';
import { getMockBettingOdds } from '../../../../lib/betting';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport') || 'soccer';
    const useMock = searchParams.get('mock') === 'true' || !process.env.ODDS_API_KEY;

    // If no API key or mock requested, return mock data
    if (useMock) {
      const odds = getMockBettingOdds();
      return NextResponse.json({
        success: true,
        odds,
        last_updated: new Date().toISOString(),
        source: 'mock',
      });
    }

    // Fetch real odds from The Odds API
    try {
      const apiOdds = await fetchOddsFromAPI(sport, ['us'], ['h2h', 'spreads', 'totals']);
      const transformedOdds = transformOddsApiResponse(apiOdds);
      
      // Convert to our BettingOdds format for compatibility
      const bettingOdds = transformedOdds.map((odds) => {
        // Use best odds or first available bookmaker
        const firstBookmaker = Object.values(odds.bookmakers)[0];
        
        return {
          id: odds.id,
          home_team: odds.home_team,
          away_team: odds.away_team,
          league: odds.sport_title,
          start_time: odds.commence_time,
          moneyline: odds.best_odds.moneyline ? {
            home: odds.best_odds.moneyline.home.odds,
            away: odds.best_odds.moneyline.away.odds,
            ...(odds.best_odds.moneyline.draw && { draw: odds.best_odds.moneyline.draw.odds }),
          } : firstBookmaker?.moneyline || { home: 0, away: 0 },
          spread: odds.best_odds.spread ? {
            home: odds.best_odds.spread.home.odds,
            away: odds.best_odds.spread.away.odds,
            line: odds.best_odds.spread.home.line,
          } : firstBookmaker?.spread || { home: 0, away: 0, line: 0 },
          total: odds.best_odds.total ? {
            over: odds.best_odds.total.over.odds,
            under: odds.best_odds.total.under.odds,
            line: odds.best_odds.total.over.line,
          } : firstBookmaker?.total || { over: 0, under: 0, line: 0 },
          last_updated: odds.last_updated,
        };
      });

      return NextResponse.json({
        success: true,
        odds: bettingOdds,
        last_updated: new Date().toISOString(),
        source: 'the-odds-api',
        raw_data: transformedOdds, // Include raw data for advanced features
      });
    } catch (apiError: any) {
      console.error('The Odds API error, falling back to mock data:', apiError);
      
      // Fallback to mock data if API fails
      const odds = getMockBettingOdds();
      return NextResponse.json({
        success: true,
        odds,
        last_updated: new Date().toISOString(),
        source: 'mock',
        error: apiError.message,
      });
    }
  } catch (error) {
    console.error('Error fetching betting odds:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch betting odds' },
      { status: 500 }
    );
  }
}
