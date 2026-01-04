import { useState } from 'react';

// Define types for search results
interface SearchResult {
  leagues: any[];
  teams: any[];
  fixtures: any[];
}

export default function SearchComponent() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Call API to search
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const getTotalResults = () => {
    if (!results) return 0;
    return results.leagues.length + results.teams.length + results.fixtures.length;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for leagues, teams, or matches..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg disabled:opacity-70"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {results && (
        <div>
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Results ({getTotalResults()})
              </button>
              <button
                onClick={() => setActiveTab('leagues')}
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === 'leagues'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Leagues ({results.leagues.length})
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === 'teams'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Teams ({results.teams.length})
              </button>
              <button
                onClick={() => setActiveTab('fixtures')}
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === 'fixtures'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Matches ({results.fixtures.length})
              </button>
            </nav>
          </div>

          {(activeTab === 'all' || activeTab === 'leagues') && results.leagues.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Leagues</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.leagues.map((league) => (
                  <a
                    key={league.league_id}
                    href={`/leagues/${league.league_id}`}
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                  >
                    {league.logo_url && (
                      <img
                        src={league.logo_url}
                        alt={league.name}
                        className="w-10 h-10 mr-3 object-contain"
                      />
                    )}
                    <div>
                      <div className="font-medium">{league.name}</div>
                      <div className="text-sm text-gray-500">{league.type}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'teams') && results.teams.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Teams</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.teams.map((team) => (
                  <a
                    key={team.team_id}
                    href={`/teams/${team.team_id}`}
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                  >
                    {team.logo_url && (
                      <img
                        src={team.logo_url}
                        alt={team.name}
                        className="w-10 h-10 mr-3 object-contain"
                      />
                    )}
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-sm text-gray-500">
                        {team.venue_name && `${team.venue_name}, `}
                        {team.venue_city}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'fixtures') && results.fixtures.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Matches</h3>
              <div className="space-y-4">
                {results.fixtures.map((fixture) => (
                  <a
                    key={fixture.fixture_id}
                    href={`/fixtures/${fixture.fixture_id}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="text-center mr-4">
                          <div className="text-sm text-gray-500">
                            {new Date(fixture.fixture_date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(fixture.fixture_date).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{fixture.home_team_name}</div>
                          <div className="font-medium">{fixture.away_team_name}</div>
                        </div>
                      </div>
                      <div className="text-center">
                        {fixture.status === 'FT' || fixture.status === 'AET' || fixture.status === 'PEN' ? (
                          <div className="text-lg font-bold">
                            {fixture.home_score} - {fixture.away_score}
                          </div>
                        ) : fixture.status === '1H' || fixture.status === '2H' || fixture.status === 'HT' ? (
                          <div>
                            <div className="text-lg font-bold">
                              {fixture.home_score} - {fixture.away_score}
                            </div>
                            <div className="text-xs font-medium text-red-600">LIVE</div>
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-gray-500">Upcoming</div>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {getTotalResults() === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">No results found for "{query}"</div>
              <div className="text-sm text-gray-400">Try different keywords or check your spelling</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
