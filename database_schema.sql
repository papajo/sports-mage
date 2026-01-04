-- Database Schema for Sports Data Integration with API-Sports

-- Countries Table
CREATE TABLE countries (
    country_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(3),  -- Alpha code of the country (2-6 characters)
    flag_url VARCHAR(255),  -- URL to country flag image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Leagues Table
CREATE TABLE leagues (
    league_id INT PRIMARY KEY AUTO_INCREMENT,
    api_league_id INT NOT NULL,  -- ID from API-Sports
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),  -- League or Cup
    country_id INT,
    logo_url VARCHAR(255),
    season_start DATE,
    season_end DATE,
    current_season INT,
    FOREIGN KEY (country_id) REFERENCES countries(country_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Teams Table
CREATE TABLE teams (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    api_team_id INT NOT NULL,  -- ID from API-Sports
    name VARCHAR(100) NOT NULL,
    country_id INT,
    logo_url VARCHAR(255),
    founded INT,  -- Year founded
    venue_name VARCHAR(100),
    venue_capacity INT,
    venue_city VARCHAR(100),
    FOREIGN KEY (country_id) REFERENCES countries(country_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- League_Teams (Junction Table for many-to-many relationship)
CREATE TABLE league_teams (
    league_team_id INT PRIMARY KEY AUTO_INCREMENT,
    league_id INT NOT NULL,
    team_id INT NOT NULL,
    season INT NOT NULL,
    FOREIGN KEY (league_id) REFERENCES leagues(league_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    UNIQUE KEY (league_id, team_id, season),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Players Table
CREATE TABLE players (
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    api_player_id INT NOT NULL,  -- ID from API-Sports
    name VARCHAR(100) NOT NULL,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    date_of_birth DATE,
    nationality VARCHAR(50),
    height VARCHAR(10),
    weight VARCHAR(10),
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Team_Players (Junction Table for many-to-many relationship)
CREATE TABLE team_players (
    team_player_id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    player_id INT NOT NULL,
    jersey_number INT,
    position VARCHAR(50),
    is_captain BOOLEAN DEFAULT FALSE,
    season INT NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    UNIQUE KEY (team_id, player_id, season),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Fixtures (Matches) Table
CREATE TABLE fixtures (
    fixture_id INT PRIMARY KEY AUTO_INCREMENT,
    api_fixture_id INT NOT NULL,  -- ID from API-Sports
    league_id INT NOT NULL,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    fixture_date DATETIME,
    status VARCHAR(20),  -- NS (Not Started), LIVE, FT (Full-Time), etc.
    round VARCHAR(50),
    season INT,
    venue VARCHAR(100),
    referee VARCHAR(100),
    home_score INT,
    away_score INT,
    halftime_home_score INT,
    halftime_away_score INT,
    fulltime_home_score INT,
    fulltime_away_score INT,
    extratime_home_score INT,
    extratime_away_score INT,
    penalty_home_score INT,
    penalty_away_score INT,
    FOREIGN KEY (league_id) REFERENCES leagues(league_id),
    FOREIGN KEY (home_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (away_team_id) REFERENCES teams(team_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events Table (Goals, Cards, Substitutions, etc.)
CREATE TABLE events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    fixture_id INT NOT NULL,
    team_id INT NOT NULL,
    player_id INT,
    assist_player_id INT,
    event_type VARCHAR(50) NOT NULL,  -- Goal, Card, Substitution, etc.
    event_detail VARCHAR(50),  -- Normal Goal, Yellow Card, etc.
    event_time INT,
    event_time_extra INT,  -- Added time
    comments TEXT,
    FOREIGN KEY (fixture_id) REFERENCES fixtures(fixture_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (assist_player_id) REFERENCES players(player_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Statistics Table
CREATE TABLE statistics (
    stat_id INT PRIMARY KEY AUTO_INCREMENT,
    fixture_id INT NOT NULL,
    team_id INT NOT NULL,
    stat_type VARCHAR(50) NOT NULL,  -- Shots on Goal, Possession, etc.
    stat_value VARCHAR(50) NOT NULL,  -- Could be numeric or percentage
    FOREIGN KEY (fixture_id) REFERENCES fixtures(fixture_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player Statistics Table
CREATE TABLE player_statistics (
    player_stat_id INT PRIMARY KEY AUTO_INCREMENT,
    fixture_id INT NOT NULL,
    player_id INT NOT NULL,
    team_id INT NOT NULL,
    minutes_played INT,
    rating DECIMAL(3,1),
    shots_total INT,
    shots_on_goal INT,
    goals INT,
    assists INT,
    passes_total INT,
    passes_accuracy INT,
    key_passes INT,
    yellow_cards INT,
    red_cards INT,
    FOREIGN KEY (fixture_id) REFERENCES fixtures(fixture_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Standings Table
CREATE TABLE standings (
    standing_id INT PRIMARY KEY AUTO_INCREMENT,
    league_id INT NOT NULL,
    team_id INT NOT NULL,
    season INT NOT NULL,
    rank INT,
    points INT,
    played INT,
    win INT,
    draw INT,
    lose INT,
    goals_for INT,
    goals_against INT,
    goal_diff INT,
    form VARCHAR(20),  -- Last 5 matches (W, D, L)
    FOREIGN KEY (league_id) REFERENCES leagues(league_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    UNIQUE KEY (league_id, team_id, season),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- API Request Log Table (for tracking API usage)
CREATE TABLE api_request_log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    endpoint VARCHAR(100) NOT NULL,
    parameters TEXT,
    response_status INT,
    response_time DECIMAL(10,3),  -- in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_leagues_country ON leagues(country_id);
CREATE INDEX idx_teams_country ON teams(country_id);
CREATE INDEX idx_fixtures_league ON fixtures(league_id);
CREATE INDEX idx_fixtures_teams ON fixtures(home_team_id, away_team_id);
CREATE INDEX idx_fixtures_date ON fixtures(fixture_date);
CREATE INDEX idx_events_fixture ON events(fixture_id);
CREATE INDEX idx_events_player ON events(player_id);
CREATE INDEX idx_statistics_fixture ON statistics(fixture_id, team_id);
CREATE INDEX idx_player_statistics_fixture ON player_statistics(fixture_id);
CREATE INDEX idx_player_statistics_player ON player_statistics(player_id);
CREATE INDEX idx_standings_league_season ON standings(league_id, season);