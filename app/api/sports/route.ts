import { NextResponse } from 'next/server';
import { getAvailableSports } from '../../../../lib/odds-api';

export async function GET() {
  try {
    // If no API key, return mock sports list
    if (!process.env.ODDS_API_KEY) {
      return NextResponse.json({
        success: true,
        sports: [
          { key: 'soccer', title: 'Soccer', active: true },
          { key: 'basketball_nba', title: 'NBA', active: true },
          { key: 'americanfootball_nfl', title: 'NFL', active: true },
          { key: 'icehockey_nhl', title: 'NHL', active: true },
          { key: 'baseball_mlb', title: 'MLB', active: true },
          { key: 'tennis', title: 'Tennis', active: true },
        ],
        source: 'mock',
      });
    }

    try {
      const sports = await getAvailableSports();
      return NextResponse.json({
        success: true,
        sports,
        source: 'the-odds-api',
      });
    } catch (error: any) {
      console.error('Error fetching sports:', error);
      return NextResponse.json({
        success: true,
        sports: [
          { key: 'soccer', title: 'Soccer', active: true },
          { key: 'basketball_nba', title: 'NBA', active: true },
          { key: 'americanfootball_nfl', title: 'NFL', active: true },
        ],
        source: 'mock',
        error: error.message,
      });
    }
  } catch (error) {
    console.error('Error in sports endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sports' },
      { status: 500 }
    );
  }
}

