import { NextResponse } from 'next/server';

export async function GET() {
  // Placeholder API route for tennis data
  // In production, this would fetch from SportRadar API
  
  // Return mock data for demonstration
  return NextResponse.json({
    live: [
      {
        id: 't1',
        competition: 'Wimbledon',
        player1: { name: 'Novak Djokovic', country: 'SRB' },
        player2: { name: 'Rafael Nadal', country: 'ESP' },
        status: 'In Progress',
        score: {
          sets: [
            { player1: 6, player2: 4 },
            { player1: 7, player2: 6 },
            { player1: 3, player2: 5 }
          ],
          currentSet: 2,
          currentGame: '40-15',
          server: 'player1'
        }
      }
    ],
    upcoming: [
      {
        id: 't2',
        competition: 'French Open',
        player1: { name: 'Roger Federer', country: 'SUI' },
        player2: { name: 'Dominic Thiem', country: 'AUT' },
        scheduledTime: new Date(Date.now() + 3600000).toISOString(),
        round: 'Quarter-final'
      }
    ]
  });
}

