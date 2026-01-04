import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../database';

// This is a placeholder - in production, you'd get the database from Cloudflare D1
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ 
        leagues: [], 
        teams: [], 
        fixtures: [] 
      });
    }

    // In production, you would use:
    // const db = getDatabase(); // Get D1 database instance
    // const dbService = new DatabaseService(db);
    // const results = await dbService.searchSports(query);
    
    // Mock search results for demonstration
    const searchTerm = query.toLowerCase();
    const mockResults = {
      leagues: [
        { league_id: 1, name: 'Premier League', type: 'League', logo_url: null },
        { league_id: 2, name: 'La Liga', type: 'League', logo_url: null }
      ].filter(l => l.name.toLowerCase().includes(searchTerm)),
      teams: [
        { team_id: 1, name: 'Manchester United', venue_name: 'Old Trafford', venue_city: 'Manchester', logo_url: null },
        { team_id: 2, name: 'Liverpool', venue_name: 'Anfield', venue_city: 'Liverpool', logo_url: null },
        { team_id: 3, name: 'Barcelona', venue_name: 'Camp Nou', venue_city: 'Barcelona', logo_url: null }
      ].filter(t => t.name.toLowerCase().includes(searchTerm)),
      fixtures: [
        { 
          fixture_id: 1, 
          home_team_name: 'Manchester United', 
          away_team_name: 'Chelsea', 
          fixture_date: new Date().toISOString(),
          status: 'NS'
        }
      ].filter(f => 
        f.home_team_name.toLowerCase().includes(searchTerm) || 
        f.away_team_name.toLowerCase().includes(searchTerm)
      )
    };
    
    return NextResponse.json(mockResults);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

