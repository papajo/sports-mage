'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fixtures data
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const mockData = [
      {
        fixture_id: 1,
        home_team_name: 'Manchester United',
        away_team_name: 'Chelsea',
        league_name: 'Premier League',
        status: 'NS',
        fixture_date: tomorrow.toISOString(),
        venue: 'Old Trafford'
      },
      {
        fixture_id: 2,
        home_team_name: 'Arsenal',
        away_team_name: 'Tottenham',
        league_name: 'Premier League',
        status: 'NS',
        fixture_date: tomorrow.toISOString(),
        venue: 'Emirates Stadium'
      },
      {
        fixture_id: 3,
        home_team_name: 'Barcelona',
        away_team_name: 'Atletico Madrid',
        league_name: 'La Liga',
        status: 'NS',
        fixture_date: tomorrow.toISOString(),
        venue: 'Camp Nou'
      },
      {
        fixture_id: 4,
        home_team_name: 'AC Milan',
        away_team_name: 'Inter Milan',
        league_name: 'Serie A',
        status: 'NS',
        fixture_date: tomorrow.toISOString(),
        venue: 'San Siro'
      }
    ];
    
    setFixtures(mockData);
    setIsLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Fixtures</h1>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">Loading fixtures...</p>
        </div>
      ) : fixtures.length > 0 ? (
        <div className="space-y-4">
          {fixtures.map((fixture) => (
            <Link
              key={fixture.fixture_id}
              href={`/fixtures/${fixture.fixture_id}`}
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">{fixture.league_name}</span>
                <span className="text-xs font-medium text-gray-500">
                  {formatDate(fixture.fixture_date)} • {formatTime(fixture.fixture_date)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-lg">{fixture.home_team_name}</span>
                    <span className="text-sm text-gray-500">vs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-lg">{fixture.away_team_name}</span>
                  </div>
                </div>
              </div>
              {fixture.venue && (
                <div className="mt-2 text-sm text-gray-500">
                  📍 {fixture.venue}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No fixtures scheduled</p>
        </div>
      )}
    </div>
  );
}

