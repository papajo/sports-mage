'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function FixtureDetailPage() {
  const params = useParams();
  const fixtureId = params?.id as string;
  const [fixture, setFixture] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fixture data
    const mockFixtures: Record<string, any> = {
      '1': {
        fixture_id: 1,
        home_team_name: 'Manchester United',
        away_team_name: 'Chelsea',
        league_name: 'Premier League',
        status: 'NS',
        fixture_date: new Date(Date.now() + 86400000).toISOString(),
        venue: 'Old Trafford',
        referee: 'Michael Oliver',
        home_score: null,
        away_score: null
      },
      '2': {
        fixture_id: 2,
        home_team_name: 'Arsenal',
        away_team_name: 'Tottenham',
        league_name: 'Premier League',
        status: 'NS',
        fixture_date: new Date(Date.now() + 86400000).toISOString(),
        venue: 'Emirates Stadium',
        referee: 'Anthony Taylor',
        home_score: null,
        away_score: null
      },
      '3': {
        fixture_id: 3,
        home_team_name: 'Barcelona',
        away_team_name: 'Atletico Madrid',
        league_name: 'La Liga',
        status: 'NS',
        fixture_date: new Date(Date.now() + 86400000).toISOString(),
        venue: 'Camp Nou',
        referee: 'Carlos del Cerro',
        home_score: null,
        away_score: null
      },
      '4': {
        fixture_id: 4,
        home_team_name: 'AC Milan',
        away_team_name: 'Inter Milan',
        league_name: 'Serie A',
        status: 'NS',
        fixture_date: new Date(Date.now() + 86400000).toISOString(),
        venue: 'San Siro',
        referee: 'Daniele Orsato',
        home_score: null,
        away_score: null
      }
    };

    const fixtureData = mockFixtures[fixtureId];
    if (fixtureData) {
      setFixture(fixtureData);
    }
    setIsLoading(false);
  }, [fixtureId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">Loading fixture details...</p>
        </div>
      </div>
    );
  }

  if (!fixture) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Fixture Not Found</h1>
          <Link href="/fixtures" className="text-blue-600 hover:text-blue-800">
            ← Back to Fixtures
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
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
      <Link href="/fixtures" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to Fixtures
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center mb-4">
          <span className="text-sm font-medium text-gray-600">{fixture.league_name}</span>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 text-right pr-8">
            <h2 className="text-2xl font-bold">{fixture.home_team_name}</h2>
            {fixture.home_score !== null && (
              <p className="text-4xl font-bold mt-2">{fixture.home_score}</p>
            )}
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">vs</p>
            {fixture.status === 'NS' && (
              <p className="text-sm text-gray-500 mt-2">{formatTime(fixture.fixture_date)}</p>
            )}
          </div>
          <div className="flex-1 text-left pl-8">
            <h2 className="text-2xl font-bold">{fixture.away_team_name}</h2>
            {fixture.away_score !== null && (
              <p className="text-4xl font-bold mt-2">{fixture.away_score}</p>
            )}
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formatDate(fixture.fixture_date)}</span>
          </div>
          {fixture.venue && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Venue:</span>
              <span className="font-medium">{fixture.venue}</span>
            </div>
          )}
          {fixture.referee && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Referee:</span>
              <span className="font-medium">{fixture.referee}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium">
              {fixture.status === 'NS' ? 'Not Started' : fixture.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href={`/teams/1`}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <h3 className="font-bold text-lg">{fixture.home_team_name}</h3>
          <p className="text-sm text-gray-600 mt-1">View team details →</p>
        </Link>
        <Link
          href={`/teams/2`}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <h3 className="font-bold text-lg">{fixture.away_team_name}</h3>
          <p className="text-sm text-gray-600 mt-1">View team details →</p>
        </Link>
      </div>
    </div>
  );
}

