'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock teams data
    const mockData = [
      {
        team_id: 1,
        name: 'Manchester United',
        country_id: 1,
        logo_url: null,
        venue_name: 'Old Trafford',
        venue_city: 'Manchester'
      },
      {
        team_id: 2,
        name: 'Liverpool',
        country_id: 1,
        logo_url: null,
        venue_name: 'Anfield',
        venue_city: 'Liverpool'
      },
      {
        team_id: 3,
        name: 'Barcelona',
        country_id: 2,
        logo_url: null,
        venue_name: 'Camp Nou',
        venue_city: 'Barcelona'
      },
      {
        team_id: 4,
        name: 'Real Madrid',
        country_id: 2,
        logo_url: null,
        venue_name: 'Santiago Bernabéu',
        venue_city: 'Madrid'
      },
      {
        team_id: 5,
        name: 'Bayern Munich',
        country_id: 4,
        logo_url: null,
        venue_name: 'Allianz Arena',
        venue_city: 'Munich'
      },
      {
        team_id: 6,
        name: 'Paris Saint-Germain',
        country_id: 5,
        logo_url: null,
        venue_name: 'Parc des Princes',
        venue_city: 'Paris'
      }
    ];
    
    setTeams(mockData);
    setIsLoading(false);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Teams</h1>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">Loading teams...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link
              key={team.team_id}
              href={`/teams/${team.team_id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                {team.logo_url && (
                  <img
                    src={team.logo_url}
                    alt={team.name}
                    className="w-12 h-12 mr-3 object-contain"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold">{team.name}</h3>
                  {team.venue_name && (
                    <p className="text-sm text-gray-500">{team.venue_name}, {team.venue_city}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

