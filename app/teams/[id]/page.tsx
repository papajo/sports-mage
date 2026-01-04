'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params?.id as string;
  const [team, setTeam] = useState<any>(null);
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock team data
    const mockTeams: Record<string, any> = {
      '1': {
        team_id: 1,
        name: 'Manchester United',
        country_id: 1,
        logo_url: null,
        venue_name: 'Old Trafford',
        venue_city: 'Manchester',
        venue_capacity: 74310,
        founded: 1878
      },
      '2': {
        team_id: 2,
        name: 'Liverpool',
        country_id: 1,
        logo_url: null,
        venue_name: 'Anfield',
        venue_city: 'Liverpool',
        venue_capacity: 53394,
        founded: 1892
      },
      '3': {
        team_id: 3,
        name: 'Barcelona',
        country_id: 2,
        logo_url: null,
        venue_name: 'Camp Nou',
        venue_city: 'Barcelona',
        venue_capacity: 99354,
        founded: 1899
      },
      '4': {
        team_id: 4,
        name: 'Real Madrid',
        country_id: 2,
        logo_url: null,
        venue_name: 'Santiago Bernabéu',
        venue_city: 'Madrid',
        venue_capacity: 81044,
        founded: 1902
      },
      '5': {
        team_id: 5,
        name: 'Bayern Munich',
        country_id: 4,
        logo_url: null,
        venue_name: 'Allianz Arena',
        venue_city: 'Munich',
        venue_capacity: 75000,
        founded: 1900
      },
      '6': {
        team_id: 6,
        name: 'Paris Saint-Germain',
        country_id: 5,
        logo_url: null,
        venue_name: 'Parc des Princes',
        venue_city: 'Paris',
        venue_capacity: 47929,
        founded: 1970
      }
    };

    const mockFixtures = [
      {
        fixture_id: 1,
        home_team_name: 'Manchester United',
        away_team_name: 'Chelsea',
        league_name: 'Premier League',
        status: 'NS',
        fixture_date: new Date(Date.now() + 86400000).toISOString()
      },
      {
        fixture_id: 2,
        home_team_name: 'Arsenal',
        away_team_name: 'Manchester United',
        league_name: 'Premier League',
        status: 'NS',
        fixture_date: new Date(Date.now() + 172800000).toISOString()
      }
    ];

    const teamData = mockTeams[teamId];
    if (teamData) {
      setTeam(teamData);
      // Filter fixtures to show only those involving this team
      const teamFixtures = mockFixtures.filter(
        f => f.home_team_name === teamData.name || f.away_team_name === teamData.name
      );
      setFixtures(teamFixtures);
    }
    setIsLoading(false);
  }, [teamId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Team Not Found</h1>
          <Link href="/teams" className="text-blue-600 hover:text-blue-800">
            ← Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Link href="/teams" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to Teams
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{team.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.venue_name && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Venue</h3>
              <p className="text-lg font-medium">{team.venue_name}</p>
              {team.venue_city && (
                <p className="text-sm text-gray-600">{team.venue_city}</p>
              )}
              {team.venue_capacity && (
                <p className="text-sm text-gray-500">Capacity: {team.venue_capacity.toLocaleString()}</p>
              )}
            </div>
          )}
          {team.founded && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Founded</h3>
              <p className="text-lg font-medium">{team.founded}</p>
            </div>
          )}
        </div>
      </div>

      {fixtures.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Fixtures</h2>
          <div className="space-y-4">
            {fixtures.map((fixture) => (
              <Link
                key={fixture.fixture_id}
                href={`/fixtures/${fixture.fixture_id}`}
                className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">{fixture.league_name}</div>
                    <div className="font-medium">
                      {fixture.home_team_name} vs {fixture.away_team_name}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(fixture.fixture_date)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

