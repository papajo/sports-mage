import { NextResponse } from 'next/server';
import { getMockBettingOdds } from '../../../../lib/betting';

export async function GET() {
  try {
    // In production, this would fetch from The Odds API or similar
    // Example:
    // const response = await fetch(
    //   `https://api.the-odds-api.com/v4/sports/soccer/odds/?apiKey=${process.env.ODDS_API_KEY}&regions=us&markets=h2h,spreads,totals`
    // );
    // const odds = await response.json();
    
    // For now, return mock data
    const odds = getMockBettingOdds();
    
    return NextResponse.json({
      success: true,
      odds,
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching betting odds:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch betting odds' },
      { status: 500 }
    );
  }
}

