'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function LeagueDetailPage() {
  const params = useParams();
  const leagueId = params?.id as string;
  const [league, setLeague] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock league data
    const mockLeagues: Record<string, any> = {
      '1': {
        league_id: 1,
        name: 'Premier League',
        type: 'League',
        country_id: 1,
        logo_url: null,
        current_season: 2024
      },
      '2': {
        league_id: 2,
        name: 'La Liga',
        type: 'League',
        country_id: 2,
        logo_url: null,
        current_season: 2024
      },
      '3': {
        league_id: 3,
        name: 'Serie A',
        type: 'League',
        country_id: 3,
        logo_url: null,
        current_season: 2024
      },
      '4': {
        league_id: 4,
        name: 'Bundesliga',
        type: 'League',
        country_id: 4,
        logo_url: null,
        current_season: 2024
      },
      '5': {
        league_id: 5,
        name: 'Ligue 1',
        type: 'League',
        country_id: 5,
        logo_url: null,
        current_season: 2024
      }
    };

    const mockTeams = [
      { team_id: 1, name: 'Manchester United', points: 45, played: 20, win: 14, draw: 3, lose: 3, goals_for: 42, goals_against: 18, goal_diff: 24 },
      { team_id: 2, name: 'Liverpool', points: 43, played: 20, win: 13, draw: 4, lose: 3, goals_for: 38, goals_against: 20, goal_diff: 18 },
      { team_id: 3, name: 'Arsenal', points: 41, played: 20, win: 12, draw: 5, lose: 3, goals_for: 35, goals_against: 22, goal_diff: 13 },
      { team_id: 4, name: 'Chelsea', points: 39, played: 20, win: 11, draw: 6, lose: 3, goals_for: 32, goals_against: 19, goal_diff: 13 },
      { team_id: 5, name: 'Tottenham', points: 37, played: 20, win: 11, draw: 4, lose: 5, goals_for: 30, goals_against: 25, goal_diff: 5 }
    ];

    const leagueData = mockLeagues[leagueId];
    if (leagueData) {
      setLeague(leagueData);
      setTeams(mockTeams);
      setStandings(mockTeams.map((team, index) => ({ ...team, rank: index + 1 })));
    }
    setIsLoading(false);
  }, [leagueId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">Loading league details...</p>
        </div>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">League Not Found</h1>
          <Link href="/leagues" className="text-blue-600 hover:text-blue-800">
            ← Back to Leagues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Link href="/leagues" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to Leagues
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{league.name}</h1>
        <p className="text-gray-600">Season {league.current_season}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Standings</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Played</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GD</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {standings.map((team) => (
                <tr key={team.team_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.rank}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/teams/${team.team_id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {team.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.played}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.win}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.draw}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.lose}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.goal_diff > 0 ? '+' : ''}{team.goal_diff}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Link
              key={team.team_id}
              href={`/teams/${team.team_id}`}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-lg">{team.name}</h3>
              <p className="text-sm text-gray-600 mt-1">Points: {team.points}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

