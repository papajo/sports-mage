'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LiveScoresPage() {
  const [liveFixtures, setLiveFixtures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock live fixtures data
    const mockData = [
      {
        fixture_id: 1,
        home_team_name: 'Manchester United',
        away_team_name: 'Liverpool',
        league_name: 'Premier League',
        status: '1H',
        home_score: 1,
        away_score: 0,
        fixture_date: new Date().toISOString(),
        minute: 23
      },
      {
        fixture_id: 2,
        home_team_name: 'Barcelona',
        away_team_name: 'Real Madrid',
        league_name: 'La Liga',
        status: '2H',
        home_score: 2,
        away_score: 1,
        fixture_date: new Date().toISOString(),
        minute: 67
      },
      {
        fixture_id: 3,
        home_team_name: 'Bayern Munich',
        away_team_name: 'Borussia Dortmund',
        league_name: 'Bundesliga',
        status: 'HT',
        home_score: 1,
        away_score: 1,
        fixture_date: new Date().toISOString(),
        minute: 45
      }
    ];
    
    setLiveFixtures(mockData);
    setIsLoading(false);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Live Scores</h1>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">Loading live scores...</p>
        </div>
      ) : liveFixtures.length > 0 ? (
        <div className="space-y-4">
          {liveFixtures.map((fixture) => (
            <div key={fixture.fixture_id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">{fixture.league_name}</span>
                  <span className="text-xs font-semibold text-red-600 animate-pulse">LIVE</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-lg">{fixture.home_team_name}</span>
                      <span className="text-2xl font-bold">{fixture.home_score}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-lg">{fixture.away_team_name}</span>
                      <span className="text-2xl font-bold">{fixture.away_score}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {fixture.status === '1H' && `First Half - ${fixture.minute}'`}
                  {fixture.status === '2H' && `Second Half - ${fixture.minute}'`}
                  {fixture.status === 'HT' && 'Half Time'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No live matches at the moment</p>
          <Link href="/fixtures" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            View upcoming fixtures →
          </Link>
        </div>
      )}
    </div>
  );
}

