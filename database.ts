import { D1Database } from '@cloudflare/workers-types';

// Type definitions for our database tables
export interface User {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
  last_login: string | null;
  is_admin: number;
  subscription_tier: string;
  subscription_expires: string | null;
}

export interface Country {
  country_id: number;
  name: string;
  code: string | null;
  flag_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface League {
  league_id: number;
  api_league_id: number;
  name: string;
  type: string | null;
  country_id: number | null;
  logo_url: string | null;
  current_season: number | null;
  season_start: string | null;
  season_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  team_id: number;
  api_team_id: number;
  name: string;
  country_id: number | null;
  logo_url: string | null;
  founded: number | null;
  venue_name: string | null;
  venue_capacity: number | null;
  venue_city: string | null;
  created_at: string;
  updated_at: string;
}

export interface Fixture {
  fixture_id: number;
  api_fixture_id: number;
  league_id: number;
  home_team_id: number;
  away_team_id: number;
  fixture_date: string | null;
  status: string | null;
  round: string | null;
  season: number | null;
  venue: string | null;
  referee: string | null;
  home_score: number | null;
  away_score: number | null;
  halftime_home_score: number | null;
  halftime_away_score: number | null;
  fulltime_home_score: number | null;
  fulltime_away_score: number | null;
  extratime_home_score: number | null;
  extratime_away_score: number | null;
  penalty_home_score: number | null;
  penalty_away_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface Standing {
  standing_id: number;
  league_id: number;
  team_id: number;
  season: number;
  rank: number | null;
  points: number | null;
  played: number | null;
  win: number | null;
  draw: number | null;
  lose: number | null;
  goals_for: number | null;
  goals_against: number | null;
  goal_diff: number | null;
  form: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  transaction_id: number;
  user_id: number;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  subscription_tier: string | null;
  transaction_date: string;
  is_test: number;
}

// Database service class
export class DatabaseService {
  constructor(private db: D1Database) {}

  // User methods
  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.db.prepare(
      'SELECT * FROM users WHERE username = ?'
    ).bind(username).first<User>();
    return user || null;
  }

  async createUser(user: Omit<User, 'user_id' | 'created_at'>): Promise<number> {
    const result = await this.db.prepare(
      'INSERT INTO users (username, email, password_hash, is_admin, subscription_tier, subscription_expires) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(
      user.username,
      user.email,
      user.password_hash,
      user.is_admin,
      user.subscription_tier,
      user.subscription_expires
    ).run();
    
    return result.meta.last_row_id;
  }

  // Countries methods
  async getCountries(): Promise<Country[]> {
    return this.db.prepare('SELECT * FROM countries ORDER BY name').all<Country>();
  }

  async getCountryById(countryId: number): Promise<Country | null> {
    const country = await this.db.prepare(
      'SELECT * FROM countries WHERE country_id = ?'
    ).bind(countryId).first<Country>();
    return country || null;
  }

  // Leagues methods
  async getLeagues(countryId?: number): Promise<League[]> {
    if (countryId) {
      return this.db.prepare(
        'SELECT * FROM leagues WHERE country_id = ? ORDER BY name'
      ).bind(countryId).all<League>();
    }
    return this.db.prepare('SELECT * FROM leagues ORDER BY name').all<League>();
  }

  async getLeagueById(leagueId: number): Promise<League | null> {
    const league = await this.db.prepare(
      'SELECT * FROM leagues WHERE league_id = ?'
    ).bind(leagueId).first<League>();
    return league || null;
  }

  // Teams methods
  async getTeams(leagueId?: number, season?: number): Promise<Team[]> {
    if (leagueId && season) {
      return this.db.prepare(`
        SELECT t.* FROM teams t
        JOIN league_teams lt ON t.team_id = lt.team_id
        WHERE lt.league_id = ? AND lt.season = ?
        ORDER BY t.name
      `).bind(leagueId, season).all<Team>();
    }
    return this.db.prepare('SELECT * FROM teams ORDER BY name').all<Team>();
  }

  async getTeamById(teamId: number): Promise<Team | null> {
    const team = await this.db.prepare(
      'SELECT * FROM teams WHERE team_id = ?'
    ).bind(teamId).first<Team>();
    return team || null;
  }

  // Fixtures methods
  async getLiveFixtures(): Promise<Fixture[]> {
    return this.db.prepare(`
      SELECT f.*, ht.name as home_team_name, at.name as away_team_name, 
             l.name as league_name, l.logo_url as league_logo
      FROM fixtures f
      JOIN teams ht ON f.home_team_id = ht.team_id
      JOIN teams at ON f.away_team_id = at.team_id
      JOIN leagues l ON f.league_id = l.league_id
      WHERE f.status IN ('1H', '2H', 'HT', 'ET', 'P', 'BT')
      ORDER BY f.fixture_date
    `).all<Fixture & { home_team_name: string, away_team_name: string, league_name: string, league_logo: string | null }>();
  }

  async getFixturesByDate(date: string): Promise<Fixture[]> {
    return this.db.prepare(`
      SELECT f.*, ht.name as home_team_name, at.name as away_team_name, 
             l.name as league_name, l.logo_url as league_logo
      FROM fixtures f
      JOIN teams ht ON f.home_team_id = ht.team_id
      JOIN teams at ON f.away_team_id = at.team_id
      JOIN leagues l ON f.league_id = l.league_id
      WHERE DATE(f.fixture_date) = DATE(?)
      ORDER BY f.fixture_date
    `).bind(date).all<Fixture & { home_team_name: string, away_team_name: string, league_name: string, league_logo: string | null }>();
  }

  async getFixtureById(fixtureId: number): Promise<Fixture | null> {
    const fixture = await this.db.prepare(`
      SELECT f.*, ht.name as home_team_name, at.name as away_team_name, 
             l.name as league_name, l.logo_url as league_logo
      FROM fixtures f
      JOIN teams ht ON f.home_team_id = ht.team_id
      JOIN teams at ON f.away_team_id = at.team_id
      JOIN leagues l ON f.league_id = l.league_id
      WHERE f.fixture_id = ?
    `).bind(fixtureId).first<Fixture & { home_team_name: string, away_team_name: string, league_name: string, league_logo: string | null }>();
    return fixture || null;
  }

  // Standings methods
  async getStandings(leagueId: number, season: number): Promise<Standing[]> {
    return this.db.prepare(`
      SELECT s.*, t.name as team_name, t.logo_url as team_logo
      FROM standings s
      JOIN teams t ON s.team_id = t.team_id
      WHERE s.league_id = ? AND s.season = ?
      ORDER BY s.rank
    `).bind(leagueId, season).all<Standing & { team_name: string, team_logo: string | null }>();
  }

  // Search methods
  async searchSports(query: string): Promise<{
    leagues: League[],
    teams: Team[],
    fixtures: Fixture[]
  }> {
    const leagues = await this.db.prepare(`
      SELECT * FROM leagues 
      WHERE name LIKE ? 
      ORDER BY name 
      LIMIT 10
    `).bind(`%${query}%`).all<League>();

    const teams = await this.db.prepare(`
      SELECT * FROM teams 
      WHERE name LIKE ? 
      ORDER BY name 
      LIMIT 10
    `).bind(`%${query}%`).all<Team>();

    const fixtures = await this.db.prepare(`
      SELECT f.*, ht.name as home_team_name, at.name as away_team_name
      FROM fixtures f
      JOIN teams ht ON f.home_team_id = ht.team_id
      JOIN teams at ON f.away_team_id = at.team_id
      WHERE ht.name LIKE ? OR at.name LIKE ?
      ORDER BY f.fixture_date DESC
      LIMIT 10
    `).bind(`%${query}%`, `%${query}%`).all<Fixture & { home_team_name: string, away_team_name: string }>();

    return {
      leagues: leagues.results,
      teams: teams.results,
      fixtures: fixtures.results
    };
  }

  // Payment methods
  async createPaymentTransaction(transaction: Omit<PaymentTransaction, 'transaction_id' | 'transaction_date'>): Promise<number> {
    const result = await this.db.prepare(`
      INSERT INTO payment_transactions 
      (user_id, amount, currency, status, payment_method, subscription_tier, is_test) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      transaction.user_id,
      transaction.amount,
      transaction.currency,
      transaction.status,
      transaction.payment_method,
      transaction.subscription_tier,
      transaction.is_test
    ).run();
    
    return result.meta.last_row_id;
  }

  async getPaymentTransactions(userId: number): Promise<PaymentTransaction[]> {
    return this.db.prepare(`
      SELECT * FROM payment_transactions
      WHERE user_id = ?
      ORDER BY transaction_date DESC
    `).bind(userId).all<PaymentTransaction>();
  }

  // Test payment methods
  async processTestPayment(
    userId: number, 
    amount: number, 
    paymentMethod: string, 
    subscriptionTier: string
  ): Promise<{ success: boolean, transaction_id?: number, error?: string }> {
    try {
      // Simulate payment processing
      let status = 'completed';
      
      // Simulate declined card for testing
      if (paymentMethod === 'test_card_declined') {
        status = 'failed';
        return {
          success: false,
          error: 'Your card was declined. Please try a different payment method.'
        };
      }
      
      // Create transaction record
      const transactionId = await this.createPaymentTransaction({
        user_id: userId,
        amount,
        currency: 'USD',
        status,
        payment_method: paymentMethod,
        subscription_tier: subscriptionTier,
        is_test: 1
      });
      
      // Update user subscription if payment successful
      if (status === 'completed') {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month subscription
        
        await this.db.prepare(`
          UPDATE users
          SET subscription_tier = ?, subscription_expires = ?
          WHERE user_id = ?
        `).bind(
          subscriptionTier,
          expiryDate.toISOString(),
          userId
        ).run();
      }
      
      return {
        success: true,
        transaction_id: transactionId
      };
    } catch (error) {
      console.error('Error processing test payment:', error);
      return {
        success: false,
        error: 'An error occurred while processing your payment.'
      };
    }
  }
}
