-- Migration number: 0001        2025-03-17
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS api_request_log;
DROP TABLE IF EXISTS countries;
DROP TABLE IF EXISTS leagues;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS league_teams;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS fixtures;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS statistics;
DROP TABLE IF EXISTS standings;
DROP TABLE IF EXISTS user_favorites;
DROP TABLE IF EXISTS payment_transactions;

-- Users table for authentication and preferences
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  is_admin BOOLEAN DEFAULT 0,
  subscription_tier TEXT DEFAULT 'free',
  subscription_expires DATETIME
);

-- API request logging for tracking usage
CREATE TABLE IF NOT EXISTS api_request_log (
  log_id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint TEXT NOT NULL,
  parameters TEXT,
  response_status INTEGER,
  response_time REAL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Countries table
CREATE TABLE IF NOT EXISTS countries (
  country_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT,
  flag_url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Leagues table
CREATE TABLE IF NOT EXISTS leagues (
  league_id INTEGER PRIMARY KEY AUTOINCREMENT,
  api_league_id INTEGER UNIQUE,
  name TEXT NOT NULL,
  type TEXT,
  country_id INTEGER,
  logo_url TEXT,
  current_season INTEGER,
  season_start DATE,
  season_end DATE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES countries(country_id)
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  team_id INTEGER PRIMARY KEY AUTOINCREMENT,
  api_team_id INTEGER UNIQUE,
  name TEXT NOT NULL,
  country_id INTEGER,
  logo_url TEXT,
  founded INTEGER,
  venue_name TEXT,
  venue_capacity INTEGER,
  venue_city TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES countries(country_id)
);

-- League-Teams junction table
CREATE TABLE IF NOT EXISTS league_teams (
  league_team_id INTEGER PRIMARY KEY AUTOINCREMENT,
  league_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  season INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (league_id) REFERENCES leagues(league_id),
  FOREIGN KEY (team_id) REFERENCES teams(team_id),
  UNIQUE(league_id, team_id, season)
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
  player_id INTEGER PRIMARY KEY AUTOINCREMENT,
  api_player_id INTEGER UNIQUE,
  name TEXT NOT NULL,
  firstname TEXT,
  lastname TEXT,
  birth_date DATE,
  nationality TEXT,
  height TEXT,
  weight TEXT,
  photo_url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Fixtures (matches) table
CREATE TABLE IF NOT EXISTS fixtures (
  fixture_id INTEGER PRIMARY KEY AUTOINCREMENT,
  api_fixture_id INTEGER UNIQUE,
  league_id INTEGER NOT NULL,
  home_team_id INTEGER NOT NULL,
  away_team_id INTEGER NOT NULL,
  fixture_date DATETIME,
  status TEXT,
  round TEXT,
  season INTEGER,
  venue TEXT,
  referee TEXT,
  home_score INTEGER,
  away_score INTEGER,
  halftime_home_score INTEGER,
  halftime_away_score INTEGER,
  fulltime_home_score INTEGER,
  fulltime_away_score INTEGER,
  extratime_home_score INTEGER,
  extratime_away_score INTEGER,
  penalty_home_score INTEGER,
  penalty_away_score INTEGER,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (league_id) REFERENCES leagues(league_id),
  FOREIGN KEY (home_team_id) REFERENCES teams(team_id),
  FOREIGN KEY (away_team_id) REFERENCES teams(team_id)
);

-- Events table (goals, cards, etc.)
CREATE TABLE IF NOT EXISTS events (
  event_id INTEGER PRIMARY KEY AUTOINCREMENT,
  fixture_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  player_id INTEGER,
  event_type TEXT NOT NULL,
  event_detail TEXT,
  event_time INTEGER,
  event_time_extra INTEGER,
  comments TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fixture_id) REFERENCES fixtures(fixture_id),
  FOREIGN KEY (team_id) REFERENCES teams(team_id),
  FOREIGN KEY (player_id) REFERENCES players(player_id)
);

-- Statistics table
CREATE TABLE IF NOT EXISTS statistics (
  statistic_id INTEGER PRIMARY KEY AUTOINCREMENT,
  fixture_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  shots_on_goal INTEGER,
  shots_off_goal INTEGER,
  total_shots INTEGER,
  blocked_shots INTEGER,
  shots_inside_box INTEGER,
  shots_outside_box INTEGER,
  fouls INTEGER,
  corner_kicks INTEGER,
  offsides INTEGER,
  ball_possession INTEGER,
  yellow_cards INTEGER,
  red_cards INTEGER,
  goalkeeper_saves INTEGER,
  total_passes INTEGER,
  passes_accurate INTEGER,
  passes_percentage INTEGER,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fixture_id) REFERENCES fixtures(fixture_id),
  FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

-- Standings table
CREATE TABLE IF NOT EXISTS standings (
  standing_id INTEGER PRIMARY KEY AUTOINCREMENT,
  league_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  season INTEGER NOT NULL,
  rank INTEGER,
  points INTEGER,
  played INTEGER,
  win INTEGER,
  draw INTEGER,
  lose INTEGER,
  goals_for INTEGER,
  goals_against INTEGER,
  goal_diff INTEGER,
  form TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (league_id) REFERENCES leagues(league_id),
  FOREIGN KEY (team_id) REFERENCES teams(team_id),
  UNIQUE(league_id, team_id, season)
);

-- User favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  favorite_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  favorite_type TEXT NOT NULL, -- 'team', 'league', 'player'
  item_id INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  UNIQUE(user_id, favorite_type, item_id)
);

-- Payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL, -- 'pending', 'completed', 'failed'
  payment_method TEXT NOT NULL,
  subscription_tier TEXT,
  transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_test BOOLEAN DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create indexes for performance
CREATE INDEX idx_leagues_country_id ON leagues(country_id);
CREATE INDEX idx_teams_country_id ON teams(country_id);
CREATE INDEX idx_league_teams_league_id ON league_teams(league_id);
CREATE INDEX idx_league_teams_team_id ON league_teams(team_id);
CREATE INDEX idx_fixtures_league_id ON fixtures(league_id);
CREATE INDEX idx_fixtures_home_team_id ON fixtures(home_team_id);
CREATE INDEX idx_fixtures_away_team_id ON fixtures(away_team_id);
CREATE INDEX idx_fixtures_fixture_date ON fixtures(fixture_date);
CREATE INDEX idx_fixtures_status ON fixtures(status);
CREATE INDEX idx_events_fixture_id ON events(fixture_id);
CREATE INDEX idx_events_team_id ON events(team_id);
CREATE INDEX idx_events_player_id ON events(player_id);
CREATE INDEX idx_statistics_fixture_id ON statistics(fixture_id);
CREATE INDEX idx_statistics_team_id ON statistics(team_id);
CREATE INDEX idx_standings_league_id ON standings(league_id);
CREATE INDEX idx_standings_team_id ON standings(team_id);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);

-- Insert test user
INSERT INTO users (username, email, password_hash, is_admin) VALUES 
  ('admin', 'admin@example.com', '$2a$10$JKbfkdsjhfkjsdhfkjsdhfkjsdhfkjsdhfkjsdhfkjsdhfkjsdhfkjsd', 1);

-- Insert test payment methods for testing
INSERT INTO payment_transactions (user_id, amount, currency, status, payment_method, subscription_tier, is_test) VALUES 
  (1, 9.99, 'USD', 'completed', 'test_card_visa', 'basic', 1),
  (1, 19.99, 'USD', 'failed', 'test_card_declined', 'premium', 1);
