-- Add tables for Tennis data

-- Tennis Tournaments/Competitions
CREATE TABLE tennis_competitions (
    competition_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    gender VARCHAR(20),
    surface VARCHAR(30),
    type VARCHAR(30),
    country_id VARCHAR(50),
    FOREIGN KEY (country_id) REFERENCES countries(country_id)
);

-- Tennis Seasons
CREATE TABLE tennis_seasons (
    season_id VARCHAR(50) PRIMARY KEY,
    competition_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    year INT,
    tournament_type VARCHAR(50),
    FOREIGN KEY (competition_id) REFERENCES tennis_competitions(competition_id)
);

-- Tennis Players
CREATE TABLE tennis_players (
    player_id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    full_name VARCHAR(100) NOT NULL,
    nationality VARCHAR(50),
    country_id VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(10),
    height INT,
    weight INT,
    plays_right_handed BOOLEAN,
    pro_year INT,
    FOREIGN KEY (country_id) REFERENCES countries(country_id)
);

-- Tennis Rankings
CREATE TABLE tennis_rankings (
    ranking_id VARCHAR(50) PRIMARY KEY,
    player_id VARCHAR(50) NOT NULL,
    ranking_type VARCHAR(20) NOT NULL, -- 'singles', 'doubles', 'race'
    rank INT NOT NULL,
    ranking_date DATE NOT NULL,
    points INT,
    movement INT,
    FOREIGN KEY (player_id) REFERENCES tennis_players(player_id)
);

-- Tennis Matches
CREATE TABLE tennis_matches (
    match_id VARCHAR(50) PRIMARY KEY,
    season_id VARCHAR(50) NOT NULL,
    competition_id VARCHAR(50) NOT NULL,
    round VARCHAR(50),
    status VARCHAR(20) NOT NULL,
    scheduled_time DATETIME,
    actual_start_time DATETIME,
    end_time DATETIME,
    venue_name VARCHAR(100),
    court_name VARCHAR(50),
    surface VARCHAR(30),
    indoor BOOLEAN,
    player1_id VARCHAR(50),
    player2_id VARCHAR(50),
    winner_id VARCHAR(50),
    match_format VARCHAR(20), -- 'best_of_3', 'best_of_5'
    FOREIGN KEY (season_id) REFERENCES tennis_seasons(season_id),
    FOREIGN KEY (competition_id) REFERENCES tennis_competitions(competition_id),
    FOREIGN KEY (player1_id) REFERENCES tennis_players(player_id),
    FOREIGN KEY (player2_id) REFERENCES tennis_players(player_id),
    FOREIGN KEY (winner_id) REFERENCES tennis_players(player_id)
);

-- Tennis Match Sets
CREATE TABLE tennis_match_sets (
    set_id VARCHAR(50) PRIMARY KEY,
    match_id VARCHAR(50) NOT NULL,
    set_number INT NOT NULL,
    player1_score INT NOT NULL,
    player2_score INT NOT NULL,
    player1_tiebreak_score INT,
    player2_tiebreak_score INT,
    winner_id VARCHAR(50),
    duration INT, -- in seconds
    FOREIGN KEY (match_id) REFERENCES tennis_matches(match_id),
    FOREIGN KEY (winner_id) REFERENCES tennis_players(player_id)
);

-- Tennis Match Statistics
CREATE TABLE tennis_match_statistics (
    stat_id VARCHAR(50) PRIMARY KEY,
    match_id VARCHAR(50) NOT NULL,
    player_id VARCHAR(50) NOT NULL,
    aces INT,
    double_faults INT,
    first_serves_in INT,
    first_serves_total INT,
    first_serve_points_won INT,
    first_serve_points_total INT,
    second_serve_points_won INT,
    second_serve_points_total INT,
    break_points_saved INT,
    break_points_faced INT,
    service_games_played INT,
    return_games_played INT,
    return_points_won INT,
    return_points_total INT,
    break_points_converted INT,
    break_points_opportunities INT,
    net_points_won INT,
    net_points_total INT,
    winners INT,
    unforced_errors INT,
    service_points_won INT,
    service_points_total INT,
    return_points_won INT,
    total_points_won INT,
    FOREIGN KEY (match_id) REFERENCES tennis_matches(match_id),
    FOREIGN KEY (player_id) REFERENCES tennis_players(player_id)
);

-- Add tables for Cricket data

-- Cricket Tournaments
CREATE TABLE cricket_tournaments (
    tournament_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    format VARCHAR(20), -- 'test', 'odi', 't20'
    host_country_id VARCHAR(50),
    FOREIGN KEY (host_country_id) REFERENCES countries(country_id)
);

-- Cricket Seasons
CREATE TABLE cricket_seasons (
    season_id VARCHAR(50) PRIMARY KEY,
    tournament_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    year INT,
    FOREIGN KEY (tournament_id) REFERENCES cricket_tournaments(tournament_id)
);

-- Cricket Teams
CREATE TABLE cricket_teams (
    team_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(20),
    country_id VARCHAR(50),
    team_type VARCHAR(20), -- 'international', 'club', 'domestic'
    FOREIGN KEY (country_id) REFERENCES countries(country_id)
);

-- Cricket Players
CREATE TABLE cricket_players (
    player_id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    full_name VARCHAR(100) NOT NULL,
    nationality VARCHAR(50),
    country_id VARCHAR(50),
    date_of_birth DATE,
    batting_style VARCHAR(30),
    bowling_style VARCHAR(50),
    role VARCHAR(30), -- 'batsman', 'bowler', 'all-rounder', 'wicket-keeper'
    FOREIGN KEY (country_id) REFERENCES countries(country_id)
);

-- Cricket Team Players (for squads)
CREATE TABLE cricket_team_players (
    team_player_id VARCHAR(50) PRIMARY KEY,
    team_id VARCHAR(50) NOT NULL,
    player_id VARCHAR(50) NOT NULL,
    jersey_number VARCHAR(10),
    start_date DATE,
    end_date DATE,
    is_captain BOOLEAN DEFAULT FALSE,
    is_wicket_keeper BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (team_id) REFERENCES cricket_teams(team_id),
    FOREIGN KEY (player_id) REFERENCES cricket_players(player_id)
);

-- Cricket Matches
CREATE TABLE cricket_matches (
    match_id VARCHAR(50) PRIMARY KEY,
    season_id VARCHAR(50) NOT NULL,
    tournament_id VARCHAR(50) NOT NULL,
    match_format VARCHAR(20) NOT NULL, -- 'test', 'odi', 't20'
    status VARCHAR(20) NOT NULL,
    scheduled_time DATETIME,
    actual_start_time DATETIME,
    end_time DATETIME,
    venue_name VARCHAR(100),
    stadium_name VARCHAR(100),
    city VARCHAR(50),
    home_team_id VARCHAR(50),
    away_team_id VARCHAR(50),
    toss_winner_id VARCHAR(50),
    toss_decision VARCHAR(20), -- 'bat', 'field'
    match_winner_id VARCHAR(50),
    man_of_match_id VARCHAR(50),
    match_number VARCHAR(20),
    coverage_level VARCHAR(20), -- 'post-match', 'core', 'advanced'
    FOREIGN KEY (season_id) REFERENCES cricket_seasons(season_id),
    FOREIGN KEY (tournament_id) REFERENCES cricket_tournaments(tournament_id),
    FOREIGN KEY (home_team_id) REFERENCES cricket_teams(team_id),
    FOREIGN KEY (away_team_id) REFERENCES cricket_teams(team_id),
    FOREIGN KEY (toss_winner_id) REFERENCES cricket_teams(team_id),
    FOREIGN KEY (match_winner_id) REFERENCES cricket_teams(team_id),
    FOREIGN KEY (man_of_match_id) REFERENCES cricket_players(player_id)
);

-- Cricket Match Innings
CREATE TABLE cricket_innings (
    innings_id VARCHAR(50) PRIMARY KEY,
    match_id VARCHAR(50) NOT NULL,
    innings_number INT NOT NULL,
    batting_team_id VARCHAR(50) NOT NULL,
    bowling_team_id VARCHAR(50) NOT NULL,
    runs INT NOT NULL DEFAULT 0,
    wickets INT NOT NULL DEFAULT 0,
    overs DECIMAL(5,1) NOT NULL DEFAULT 0,
    extras INT NOT NULL DEFAULT 0,
    declared BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (match_id) REFERENCES cricket_matches(match_id),
    FOREIGN KEY (batting_team_id) REFERENCES cricket_teams(team_id),
    FOREIGN KEY (bowling_team_id) REFERENCES cricket_teams(team_id)
);

-- Cricket Batting Statistics
CREATE TABLE cricket_batting_stats (
    batting_stat_id VARCHAR(50) PRIMARY KEY,
    innings_id VARCHAR(50) NOT NULL,
    player_id VARCHAR(50) NOT NULL,
    runs INT NOT NULL DEFAULT 0,
    balls_faced INT NOT NULL DEFAULT 0,
    fours INT NOT NULL DEFAULT 0,
    sixes INT NOT NULL DEFAULT 0,
    strike_rate DECIMAL(6,2),
    how_out VARCHAR(50),
    bowled_by VARCHAR(50),
    caught_by VARCHAR(50),
    minutes_batted INT,
    position INT,
    FOREIGN KEY (innings_id) REFERENCES cricket_innings(innings_id),
    FOREIGN KEY (player_id) REFERENCES cricket_players(player_id),
    FOREIGN KEY (bowled_by) REFERENCES cricket_players(player_id),
    FOREIGN KEY (caught_by) REFERENCES cricket_players(player_id)
);

-- Cricket Bowling Statistics
CREATE TABLE cricket_bowling_stats (
    bowling_stat_id VARCHAR(50) PRIMARY KEY,
    innings_id VARCHAR(50) NOT NULL,
    player_id VARCHAR(50) NOT NULL,
    overs DECIMAL(5,1) NOT NULL DEFAULT 0,
    maidens INT NOT NULL DEFAULT 0,
    runs INT NOT NULL DEFAULT 0,
    wickets INT NOT NULL DEFAULT 0,
    economy_rate DECIMAL(5,2),
    dots INT,
    fours_conceded INT,
    sixes_conceded INT,
    wides INT,
    no_balls INT,
    FOREIGN KEY (innings_id) REFERENCES cricket_innings(innings_id),
    FOREIGN KEY (player_id) REFERENCES cricket_players(player_id)
);

-- Cricket Tournament Standings
CREATE TABLE cricket_standings (
    standing_id VARCHAR(50) PRIMARY KEY,
    season_id VARCHAR(50) NOT NULL,
    team_id VARCHAR(50) NOT NULL,
    position INT,
    played INT NOT NULL DEFAULT 0,
    won INT NOT NULL DEFAULT 0,
    lost INT NOT NULL DEFAULT 0,
    drawn INT NOT NULL DEFAULT 0,
    no_result INT NOT NULL DEFAULT 0,
    points INT NOT NULL DEFAULT 0,
    net_run_rate DECIMAL(5,3),
    group_name VARCHAR(50),
    FOREIGN KEY (season_id) REFERENCES cricket_seasons(season_id),
    FOREIGN KEY (team_id) REFERENCES cricket_teams(team_id)
);