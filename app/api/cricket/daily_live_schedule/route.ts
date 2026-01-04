import { NextResponse } from 'next/server';

export async function GET() {
  // Placeholder API route for cricket data
  // In production, this would fetch from SportRadar API
  
  // Return mock data for demonstration
  return NextResponse.json({
    live: [
      {
        id: 'c1',
        competition: 'ICC World Cup',
        team1: { name: 'India', code: 'IND' },
        team2: { name: 'Australia', code: 'AUS' },
        status: 'In Progress',
        score: {
          team1: { runs: 245, wickets: 6, overs: '42.3' },
          team2: { runs: 0, wickets: 0, overs: '0.0' },
          currentInnings: 1,
          currentBatsmen: ['Virat Kohli (78)', 'Hardik Pandya (23)'],
          currentBowler: 'Pat Cummins (2/45)'
        }
      }
    ],
    upcoming: [
      {
        id: 'c2',
        competition: 'IPL',
        team1: { name: 'Mumbai Indians', code: 'MI' },
        team2: { name: 'Chennai Super Kings', code: 'CSK' },
        scheduledTime: new Date(Date.now() + 7200000).toISOString(),
        format: 'T20'
      }
    ]
  });
}

