'use client';

import React, { useState, useEffect } from 'react';

interface TennisLiveMatch {
  id: string;
  competition: string;
  player1: { name: string; country: string };
  player2: { name: string; country: string };
  status: string;
  score: {
    sets: { player1: number; player2: number }[];
    currentSet: number;
    currentGame: string;
    server: string;
  };
}

interface TennisUpcomingMatch {
  id: string;
  competition: string;
  player1: { name: string; country: string };
  player2: { name: string; country: string };
  scheduledTime: string;
  round: string;
}

interface CricketLiveMatch {
  id: string;
  competition: string;
  team1: { name: string; code: string };
  team2: { name: string; code: string };
  status: string;
  score: {
    team1: { runs: number; wickets: number; overs: string };
    team2: { runs: number; wickets: number; overs: string };
    currentInnings: number;
    currentBatsmen: string[];
    currentBowler: string;
  };
}

interface CricketUpcomingMatch {
  id: string;
  competition: string;
  team1: { name: string; code: string };
  team2: { name: string; code: string };
  scheduledTime: string;
  venue?: string;
  format: string;
}

export default function TennisCricketDashboard() {
  const [activeTab, setActiveTab] = useState('tennis');
  const [tennisData, setTennisData] = useState<{ live: TennisLiveMatch[]; upcoming: TennisUpcomingMatch[] }>({ live: [], upcoming: [] });
  const [cricketData, setCricketData] = useState<{ live: CricketLiveMatch[]; upcoming: CricketUpcomingMatch[] }>({ live: [], upcoming: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch data from the API
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulated API calls
        const tennisResponse = await fetch('/api/tennis/daily_summaries');
        const cricketResponse = await fetch('/api/cricket/daily_live_schedule');
        
        if (tennisResponse.ok && cricketResponse.ok) {
          const tennisData = await tennisResponse.json();
          const cricketData = await cricketResponse.json();
          
          setTennisData(tennisData);
          setCricketData(cricketData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Set up polling for live updates
    const intervalId = setInterval(fetchData, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);

  // For demo purposes, using mock data
  const mockTennisData = {
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
      },
      {
        id: 't2',
        competition: 'US Open',
        player1: { name: 'Serena Williams', country: 'USA' },
        player2: { name: 'Naomi Osaka', country: 'JPN' },
        status: 'In Progress',
        score: {
          sets: [
            { player1: 3, player2: 6 },
            { player1: 6, player2: 4 },
            { player1: 2, player2: 1 }
          ],
          currentSet: 2,
          currentGame: '15-30',
          server: 'player2'
        }
      }
    ],
    upcoming: [
      {
        id: 't3',
        competition: 'French Open',
        player1: { name: 'Roger Federer', country: 'SUI' },
        player2: { name: 'Dominic Thiem', country: 'AUT' },
        scheduledTime: '2025-03-17T16:30:00Z',
        round: 'Quarter-final'
      },
      {
        id: 't4',
        competition: 'Australian Open',
        player1: { name: 'Ashleigh Barty', country: 'AUS' },
        player2: { name: 'Simona Halep', country: 'ROU' },
        scheduledTime: '2025-03-17T18:00:00Z',
        round: 'Semi-final'
      }
    ]
  };

  const mockCricketData = {
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
      },
      {
        id: 'c2',
        competition: 'T20 International',
        team1: { name: 'England', code: 'ENG' },
        team2: { name: 'South Africa', code: 'SA' },
        status: 'In Progress',
        score: {
          team1: { runs: 189, wickets: 10, overs: '19.4' },
          team2: { runs: 112, wickets: 3, overs: '12.2' },
          currentInnings: 2,
          currentBatsmen: ['Quinton de Kock (67)', 'David Miller (28)'],
          currentBowler: 'Jofra Archer (1/23)'
        }
      }
    ],
    upcoming: [
      {
        id: 'c3',
        competition: 'IPL',
        team1: { name: 'Mumbai Indians', code: 'MI' },
        team2: { name: 'Chennai Super Kings', code: 'CSK' },
        scheduledTime: '2025-03-17T14:00:00Z',
        format: 'T20'
      },
      {
        id: 'c4',
        competition: 'Test Match',
        team1: { name: 'New Zealand', code: 'NZ' },
        team2: { name: 'Pakistan', code: 'PAK' },
        scheduledTime: '2025-03-18T00:00:00Z',
        format: 'Test'
      }
    ]
  };

  // Use mock data for the demo
  useEffect(() => {
    setTennisData(mockTennisData);
    setCricketData(mockCricketData);
    setIsLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Tennis & Cricket Live Scores</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('tennis')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'tennis'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tennis
            </button>
            <button
              onClick={() => setActiveTab('cricket')}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'cricket'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cricket
            </button>
          </nav>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">Loading data...</p>
        </div>
      ) : (
        <div>
          {activeTab === 'tennis' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Live Tennis Matches</h2>
              {tennisData.live.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {tennisData.live.map((match: any) => (
                    <div key={match.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-600">{match.competition}</span>
                          <span className="text-xs font-semibold text-red-600 animate-pulse">LIVE</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="font-medium">{match.player1.name}</span>
                              <span className="ml-2 text-xs bg-gray-200 px-1 rounded">{match.player1.country}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">{match.player2.name}</span>
                              <span className="ml-2 text-xs bg-gray-200 px-1 rounded">{match.player2.country}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              {match.score.sets.map((set: any, index: number) => (
                                <div key={index} className="flex space-x-2">
                                  <span className={index === match.score.currentSet ? 'font-bold' : ''}>{set.player1}</span>
                                  <span className={index === match.score.currentSet ? 'font-bold' : ''}>{set.player2}</span>
                                </div>
                              ))}
                            </div>
                            {match.score.currentGame && (
                              <div className="mt-1 text-xs font-medium">
                                {match.score.currentGame} • {match.score.server === 'player1' ? match.player1.name.split(' ')[0] : match.player2.name.split(' ')[0]} serving
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No live tennis matches at the moment</p>
                </div>
              )}

              <h2 className="text-2xl font-bold mb-4">Upcoming Tennis Matches</h2>
              {tennisData.upcoming.length > 0 ? (
                <div className="space-y-4">
                  {tennisData.upcoming.map((match: any) => (
                    <div key={match.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-600">{match.competition}</span>
                          <span className="text-xs font-medium text-gray-500">{match.round}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="font-medium">{match.player1.name}</span>
                              <span className="ml-2 text-xs bg-gray-200 px-1 rounded">{match.player1.country}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">{match.player2.name}</span>
                              <span className="ml-2 text-xs bg-gray-200 px-1 rounded">{match.player2.country}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">{formatDate(match.scheduledTime)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No upcoming tennis matches</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cricket' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Live Cricket Matches</h2>
              {cricketData.live.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {cricketData.live.map((match: any) => (
                    <div key={match.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-600">{match.competition}</span>
                          <span className="text-xs font-semibold text-red-600 animate-pulse">LIVE</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="font-medium">{match.team1.name}</span>
                              <span className="ml-2 text-xs bg-gray-200 px-1 rounded">{match.team1.code}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">{match.team2.name}</span>
                              <span className="ml-2 text-xs bg-gray-200 px-1 rounded">{match.team2.code}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="space-y-1">
                              <div className={`text-sm ${match.score.currentInnings === 1 ? 'font-bold' : ''}`}>
                                {match.score.team1.runs}/{match.score.team1.wickets} ({match.score.team1.overs})
                              </div>
                              <div className={`text-sm ${match.score.currentInnings === 2 ? 'font-bold' : ''}`}>
                                {match.score.team2.runs}/{match.score.team2.wickets} ({match.score.team2.overs})
                              </div>
                            </div>
                            <div className="mt-2 text-xs">
                              <div>{match.score.currentBatsmen[0]}</div>
                              <div>{match.score.currentBatsmen[1]}</div>
                              <div className="mt-1">{match.score.currentBowler}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No live cricket matches at the moment</p>
                </div>
              )}

              <h2 className="text-2xl font-bold mb-4">Upcoming Cricket Matches</h2>
              {cricketData.upcoming.length > 0 ? (
                <div className="space-y-4">
                  {cricketData.upcoming.map((match: any) => (
                    <div key={match.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-600">{match.competition}</span>
                          <span className="text-xs font-medium text-gray-500">{match.format}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="font-medium">{match.team1.name}</span>
                              <span className="ml-2 text-xs bg-gray-200 px-1 rounded">{match.team1.code}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">{match.team2.name}</span>
                              <span className="ml-2 text-xs bg-gray-200 px-1 rounded">{match.team2.code}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">{formatDate(match.scheduledTime)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No upcoming cricket matches</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

