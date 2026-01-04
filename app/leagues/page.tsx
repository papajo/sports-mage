'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock leagues data
    const mockData = [
      {
        league_id: 1,
        name: 'Premier League',
        type: 'League',
        country_id: 1,
        logo_url: null,
        current_season: 2024
      },
      {
        league_id: 2,
        name: 'La Liga',
        type: 'League',
        country_id: 2,
        logo_url: null,
        current_season: 2024
      },
      {
        league_id: 3,
        name: 'Serie A',
        type: 'League',
        country_id: 3,
        logo_url: null,
        current_season: 2024
      },
      {
        league_id: 4,
        name: 'Bundesliga',
        type: 'League',
        country_id: 4,
        logo_url: null,
        current_season: 2024
      },
      {
        league_id: 5,
        name: 'Ligue 1',
        type: 'League',
        country_id: 5,
        logo_url: null,
        current_season: 2024
      }
    ];
    
    setLeagues(mockData);
    setIsLoading(false);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Leagues</h1>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">Loading leagues...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagues.map((league) => (
            <Link
              key={league.league_id}
              href={`/leagues/${league.league_id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                {league.logo_url && (
                  <img
                    src={league.logo_url}
                    alt={league.name}
                    className="w-12 h-12 mr-3 object-contain"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold">{league.name}</h3>
                  <p className="text-sm text-gray-500">{league.type}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Season: {league.current_season}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

