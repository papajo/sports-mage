#!/usr/bin/env python3
"""
Sports Data Fetcher - Main Script

This script fetches data from API-Sports and populates the database
according to the defined schema.
"""

import os
import sys
import time
import json
import logging
import requests
import mysql.connector
from datetime import datetime
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("sports_data_fetcher.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("sports_data_fetcher")

# Load environment variables
load_dotenv()

# API Configuration
API_KEY = os.getenv("API_SPORTS_KEY", "YOUR_API_KEY")
API_BASE_URL = "https://v3.football.api-sports.io"
API_HEADERS = {
    "x-apisports-key": API_KEY,
}

# Database Configuration
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "sports_data"),
}

class APIRequestError(Exception):
    """Exception raised for API request errors."""
    pass

class DatabaseError(Exception):
    """Exception raised for database errors."""
    pass

class SportsDataFetcher:
    """Class to fetch sports data from API-Sports and populate the database."""
    
    def __init__(self):
        """Initialize the fetcher with API and database connections."""
        self.session = requests.Session()
        self.session.headers.update(API_HEADERS)
        self.db_conn = None
        self.db_cursor = None
        
    def connect_to_database(self):
        """Establish connection to the database."""
        try:
            self.db_conn = mysql.connector.connect(**DB_CONFIG)
            self.db_cursor = self.db_conn.cursor(dictionary=True)
            logger.info("Successfully connected to the database")
        except mysql.connector.Error as err:
            logger.error(f"Database connection error: {err}")
            raise DatabaseError(f"Failed to connect to database: {err}")
    
    def close_database_connection(self):
        """Close the database connection."""
        if self.db_cursor:
            self.db_cursor.close()
        if self.db_conn:
            self.db_conn.close()
        logger.info("Database connection closed")
    
    def log_api_request(self, endpoint, parameters, status, response_time):
        """Log API request to the database for tracking."""
        try:
            query = """
            INSERT INTO api_request_log 
            (endpoint, parameters, response_status, response_time) 
            VALUES (%s, %s, %s, %s)
            """
            self.db_cursor.execute(query, (
                endpoint, 
                json.dumps(parameters) if parameters else None, 
                status, 
                response_time
            ))
            self.db_conn.commit()
        except mysql.connector.Error as err:
            logger.warning(f"Failed to log API request: {err}")
    
    def make_api_request(self, endpoint, params=None):
        """Make a request to the API-Sports API with error handling and rate limiting."""
        url = f"{API_BASE_URL}/{endpoint}"
        start_time = time.time()
        status_code = None
        
        try:
            response = self.session.get(url, params=params)
            status_code = response.status_code
            response_time = time.time() - start_time
            
            # Log the API request
            self.log_api_request(endpoint, params, status_code, response_time)
            
            # Check for rate limiting
            if status_code == 429:
                logger.warning("Rate limit exceeded. Waiting before retrying...")
                time.sleep(60)  # Wait for 60 seconds before retrying
                return self.make_api_request(endpoint, params)
            
            # Check for successful response
            response.raise_for_status()
            
            # Parse JSON response
            data = response.json()
            
            # Check API response structure
            if "errors" in data and data["errors"]:
                error_msg = json.dumps(data["errors"])
                logger.error(f"API returned errors: {error_msg}")
                raise APIRequestError(f"API returned errors: {error_msg}")
            
            # Check if response contains expected data
            if "response" not in data:
                logger.error("API response missing 'response' field")
                raise APIRequestError("API response missing 'response' field")
            
            logger.info(f"Successfully fetched data from {endpoint}")
            return data["response"]
            
        except requests.exceptions.RequestException as err:
            logger.error(f"API request error: {err}")
            raise APIRequestError(f"Failed to make API request: {err}")
    
    def fetch_countries(self):
        """Fetch countries data from API and insert into database."""
        logger.info("Fetching countries data...")
        
        try:
            countries = self.make_api_request("countries")
            
            for country in countries:
                # Check if country already exists
                self.db_cursor.execute(
                    "SELECT country_id FROM countries WHERE name = %s", 
                    (country["name"],)
                )
                result = self.db_cursor.fetchone()
                
                if result:
                    # Update existing country
                    query = """
                    UPDATE countries 
                    SET code = %s, flag_url = %s, updated_at = NOW() 
                    WHERE country_id = %s
                    """
                    self.db_cursor.execute(query, (
                        country.get("code"),
                        f"https://media.api-sports.io/flags/{country.get('code')}.svg" if country.get("code") else None,
                        result["country_id"]
                    ))
                else:
                    # Insert new country
                    query = """
                    INSERT INTO countries (name, code, flag_url) 
                    VALUES (%s, %s, %s)
                    """
                    self.db_cursor.execute(query, (
                        country["name"],
                        country.get("code"),
                        f"https://media.api-sports.io/flags/{country.get('code')}.svg" if country.get("code") else None
                    ))
            
            self.db_conn.commit()
            logger.info(f"Successfully processed {len(countries)} countries")
            
        except (APIRequestError, DatabaseError) as err:
            logger.error(f"Error fetching countries: {err}")
            self.db_conn.rollback()
            raise
    
    def fetch_leagues(self, country=None, season=None):
        """Fetch leagues data from API and insert into database."""
        logger.info(f"Fetching leagues data for country={country}, season={season}...")
        
        params = {}
        if country:
            params["country"] = country
        if season:
            params["season"] = season
        
        try:
            leagues = self.make_api_request("leagues", params)
            
            for league_data in leagues:
                league = league_data["league"]
                country = league_data["country"]
                seasons = league_data["seasons"]
                
                # Get country_id
                country_id = None
                if country["name"]:
                    self.db_cursor.execute(
                        "SELECT country_id FROM countries WHERE name = %s", 
                        (country["name"],)
                    )
                    country_result = self.db_cursor.fetchone()
                    
                    if country_result:
                        country_id = country_result["country_id"]
                    else:
                        # Insert country if it doesn't exist
                        self.db_cursor.execute(
                            "INSERT INTO countries (name, code, flag_url) VALUES (%s, %s, %s)",
                            (
                                country["name"],
                                country.get("code"),
                                country.get("flag")
                            )
                        )
                        country_id = self.db_cursor.lastrowid
                
                # Check if league already exists
                self.db_cursor.execute(
                    "SELECT league_id FROM leagues WHERE api_league_id = %s", 
                    (league["id"],)
                )
                result = self.db_cursor.fetchone()
                
                # Get current season info
                current_season = None
                season_start = None
                season_end = None
                
                for season in seasons:
                    if season.get("current", False):
                        current_season = season.get("year")
                        season_start = season.get("start")
                        season_end = season.get("end")
                        break
                
                if result:
                    # Update existing league
                    query = """
                    UPDATE leagues 
                    SET name = %s, type = %s, country_id = %s, logo_url = %s,
                        season_start = %s, season_end = %s, current_season = %s,
                        updated_at = NOW() 
                    WHERE league_id = %s
                    """
                    self.db_cursor.execute(query, (
                        league["name"],
                        league.get("type"),
                        country_id,
                        league.get("logo"),
                        season_start,
                        season_end,
                        current_season,
                        result["league_id"]
                    ))
                else:
                    # Insert new league
                    query = """
                    INSERT INTO leagues 
                    (api_league_id, name, type, country_id, logo_url, 
                     season_start, season_end, current_season) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    self.db_cursor.execute(query, (
                        league["id"],
                        league["name"],
                        league.get("type"),
                        country_id,
                        league.get("logo"),
                        season_start,
                        season_end,
                        current_season
                    ))
            
            self.db_conn.commit()
            logger.info(f"Successfully processed {len(leagues)} leagues")
            
        except (APIRequestError, DatabaseError) as err:
            logger.error(f"Error fetching leagues: {err}")
            self.db_conn.rollback()
            raise
    
    def fetch_teams(self, league_id, season):
        """Fetch teams data for a specific league and season."""
        logger.info(f"Fetching teams data for league_id={league_id}, season={season}...")
        
        try:
            # Get API league_id
            self.db_cursor.execute(
                "SELECT api_league_id FROM leagues WHERE league_id = %s", 
                (league_id,)
            )
            league_result = self.db_cursor.fetchone()
            
            if not league_result:
                logger.error(f"League with ID {league_id} not found in database")
                return
            
            api_league_id = league_result["api_league_id"]
            
            # Fetch teams from API
            params = {
                "league": api_league_id,
                "season": season
            }
            teams_data = self.make_api_request("teams", params)
            
            for team_data in teams_data:
                team = team_data["team"]
                venue = team_data.get("venue", {})
                
                # Get country_id
                country_id = None
                if team.get("country"):
                    self.db_cursor.execute(
                        "SELECT country_id FROM countries WHERE name = %s", 
                        (team["country"],)
                    )
                    country_result = self.db_cursor.fetchone()
                    
                    if country_result:
                        country_id = country_result["country_id"]
                
                # Check if team already exists
                self.db_cursor.execute(
                    "SELECT team_id FROM teams WHERE api_team_id = %s", 
                    (team["id"],)
                )
                result = self.db_cursor.fetchone()
                
                team_id = None
                
                if result:
                    # Update existing team
                    query = """
                    UPDATE teams 
                    SET name = %s, country_id = %s, logo_url = %s, founded = %s,
                        venue_name = %s, venue_capacity = %s, venue_city = %s,
                        updated_at = NOW() 
                    WHERE team_id = %s
                    """
                    self.db_cursor.execute(query, (
                        team["name"],
                        country_id,
                        team.get("logo"),
                        team.get("founded"),
                        venue.get("name"),
                        venue.get("capacity"),
                        venue.get("city"),
                        result["team_id"]
                    ))
                    team_id = result["team_id"]
                else:
                    # Insert new team
                    query = """
                    INSERT INTO teams 
                    (api_team_id, name, country_id, logo_url, founded, 
                     venue_name, venue_capacity, venue_city) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    self.db_cursor.execute(query, (
                        team["id"],
                        team["name"],
                        country_id,
                        team.get("logo"),
                        team.get("founded"),
                        venue.get("name"),
                        venue.get("capacity"),
                        venue.get("city")
                    ))
                    team_id = self.db_cursor.lastrowid
                
                # Add team to league_teams junction table
                self.db_cursor.execute(
                    """
                    SELECT league_team_id FROM league_teams 
                    WHERE league_id = %s AND team_id = %s AND season = %s
                    """, 
                    (league_id, team_id, season)
                )
                lt_result = self.db_cursor.fetchone()
                
                if not lt_result:
                    self.db_cursor.execute(
                        """
                        INSERT INTO league_teams (league_id, team_id, season) 
                        VALUES (%s, %s, %s)
                        """,
                        (league_id, team_id, season)
                    )
            
            self.db_conn.commit()
            logger.info(f"Successfully processed {len(teams_data)} teams for league {league_id}, season {season}")
            
        except (APIRequestError, DatabaseError) as err:
            logger.error(f"Error fetching teams: {err}")
            self.db_conn.rollback()
            raise
    
    def fetch_fixtures(self, league_id, season, status=None):
        """Fetch fixtures (matches) data for a specific league and season."""
        logger.info(f"Fetching fixtures for league_id={league_id}, season={season}, status={status}...")
        
        try:
            # Get API league_id
            self.db_cursor.execute(
                "SELECT api_league_id FROM leagues WHERE league_id = %s", 
                (league_id,)
            )
            league_result = self.db_cursor.fetchone()
            
            if not league_result:
                logger.error(f"League with ID {league_id} not found in database")
                return
            
            api_league_id = league_result["api_league_id"]
            
            # Fetch fixtures from API
            params = {
                "league": api_league_id,
                "season": season
            }
            
            if status:
                params["status"] = status
            
            fixtures_data = self.make_api_request("fixtures", params)
            
            for fixture_data in fixtures_data:
                fixture = fixture_data["fixture"]
                league = fixture_data["league"]
                teams = fixture_data["teams"]
                goals = fixture_data["goals"]
                score = fixture_data["score"]
                
                # Get home and away team IDs
                home_team_id = None
                away_team_id = None
                
                # Get home team
                self.db_cursor.execute(
                    "SELECT team_id FROM teams WHERE api_team_id = %s", 
                    (teams["home"]["id"],)
                )
                home_result = self.db_cursor.fetchone()
                
                if home_result:
                    home_team_id = home_result["team_id"]
                
                # Get away team
                self.db_cursor.execute(
                    "SELECT team_id FROM teams WHERE api_team_id = %s", 
                    (teams["away"]["id"],)
                )
                away_result = self.db_cursor.fetchone()
                
                if away_result:
                    away_team_id = away_result["team_id"]
                
                # Skip if we can't find both teams
                if not home_team_id or not away_team_id:
                    logger.warning(f"Skipping fixture {fixture['id']} - missing team IDs")
                    continue
                
                # Check if fixture already exists
                self.db_cursor.execute(
                    "SELECT fixture_id FROM fixtures WHERE api_fixture_id = %s", 
                    (fixture["id"],)
                )
                result = self.db_cursor.fetchone()
                
                fixture_date = None
                if fixture.get("date"):
                    try:
                        fixture_date = datetime.fromisoformat(fixture["date"].replace("Z", "+00:00"))
                    except (ValueError, TypeError):
                        logger.warning(f"Invalid date format for fixture {fixture['id']}: {fixture.get('date')}")
                
                if result:
                    # Update existing fixture
                    query = """
                    UPDATE fixtures 
                    SET league_id = %s, home_team_id = %s, away_team_id = %s,
                        fixture_date = %s, status = %s, round = %s, season = %s,
                        venue = %s, referee = %s, home_score = %s, away_score = %s,
                        halftime_home_score = %s, halftime_away_score = %s,
                        fulltime_home_score = %s, fulltime_away_score = %s,
                        extratime_home_score = %s, extratime_away_score = %s,
                        penalty_home_score = %s, penalty_away_score = %s,
                        updated_at = NOW() 
                    WHERE fixture_id = %s
                    """
                    self.db_cursor.execute(query, (
                        league_id,
                        home_team_id,
                        away_team_id,
                        fixture_date,
                        fixture.get("status", {}).get("short"),
                        league.get("round"),
                        season,
                        fixture.get("venue", {}).get("name"),
                        fixture.get("referee"),
                        goals.get("home"),
                        goals.get("away"),
                        score.get("halftime", {}).get("home"),
                        score.get("halftime", {}).get("away"),
                        score.get("fulltime", {}).get("home"),
                        score.get("fulltime", {}).get("away"),
                        score.get("extratime", {}).get("home"),
                        score.get("extratime", {}).get("away"),
                        score.get("penalty", {}).get("home"),
                        score.get("penalty", {}).get("away"),
                        result["fixture_id"]
                    ))
                else:
                    # Insert new fixture
                    query = """
                    INSERT INTO fixtures 
                    (api_fixture_id, league_id, home_team_id, away_team_id,
                     fixture_date, status, round, season, venue, referee,
                     home_score, away_score, halftime_home_score, halftime_away_score,
                     fulltime_home_score, fulltime_away_score, extratime_home_score,
                     extratime_away_score, penalty_home_score, penalty_away_score) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    self.db_cursor.execute(query, (
                        fixture["id"],
                        league_id,
                        home_team_id,
                        away_team_id,
                        fixture_date,
                        fixture.get("status", {}).get("short"),
                        league.get("round"),
                        season,
                        fixture.get("venue", {}).get("name"),
                        fixture.get("referee"),
                        goals.get("home"),
                        goals.get("away"),
                        score.get("halftime", {}).get("home"),
                        score.get("halftime", {}).get("away"),
                        score.get("fulltime", {}).get("home"),
                        score.get("fulltime", {}).get("away"),
                        score.get("extratime", {}).get("home"),
                        score.get("extratime", {}).get("away"),
                        score.get("penalty", {}).get("home"),
                        score.get("penalty", {}).get("away")
                    ))
            
            self.db_conn.commit()
            logger.info(f"Successfully processed {len(fixtures_data)} fixtures for league {league_id}, season {season}")
            
        except (APIRequestError, DatabaseError) as err:
            logger.error(f"Error fetching fixtures: {err}")
            self.db_conn.rollback()
            raise
    
    def fetch_standings(self, league_id, season):
        """Fetch standings data for a specific league and season."""
        logger.info(f"Fetching standings for league_id={league_id}, season={season}...")
        
        try:
            # Get API league_id
            self.db_cursor.execute(
                "SELECT api_league_id FROM leagues WHERE league_id = %s", 
                (league_id,)
            )
            league_result = self.db_cursor.fetchone()
            
            if not league_result:
                logger.error(f"League with ID {league_id} not found in database")
                return
            
            api_league_id = league_result["api_league_id"]
            
            # Fetch standings from API
            params = {
                "league": api_league_id,
                "season": season
            }
            
            standings_data = self.make_api_request("standings", params)
            
            if not standings_data:
                logger.warning(f"No standings data available for league {league_id}, season {season}")
                return
            
            # Process each league's standings
            for league_standings in standings_data:
                for standings_group in league_standings.get("league", {}).get("standings", []):
                    for standing in standings_group:
                        team = standing.get("team", {})
                        
                        # Get team_id
                        self.db_cursor.execute(
                            "SELECT team_id FROM teams WHERE api_team_id = %s", 
                            (team.get("id"),)
                        )
                        team_result = self.db_cursor.fetchone()
                        
                        if not team_result:
                            logger.warning(f"Team with API ID {team.get('id')} not found in database")
                            continue
                        
                        team_id = team_result["team_id"]
                        
                        # Check if standing already exists
                        self.db_cursor.execute(
                            """
                            SELECT standing_id FROM standings 
                            WHERE league_id = %s AND team_id = %s AND season = %s
                            """, 
                            (league_id, team_id, season)
                        )
                        result = self.db_cursor.fetchone()
                        
                        if result:
                            # Update existing standing
                            query = """
                            UPDATE standings 
                            SET rank = %s, points = %s, played = %s, win = %s,
                                draw = %s, lose = %s, goals_for = %s, goals_against = %s,
                                goal_diff = %s, form = %s, updated_at = NOW() 
                            WHERE standing_id = %s
                            """
                            self.db_cursor.execute(query, (
                                standing.get("rank"),
                                standing.get("points"),
                                standing.get("all", {}).get("played"),
                                standing.get("all", {}).get("win"),
                                standing.get("all", {}).get("draw"),
                                standing.get("all", {}).get("lose"),
                                standing.get("all", {}).get("goals", {}).get("for"),
                                standing.get("all", {}).get("goals", {}).get("against"),
                                standing.get("goalsDiff"),
                                standing.get("form"),
                                result["standing_id"]
                            ))
                        else:
                            # Insert new standing
                            query = """
                            INSERT INTO standings 
                            (league_id, team_id, season, rank, points, played,
                             win, draw, lose, goals_for, goals_against, goal_diff, form) 
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                            """
                            self.db_cursor.execute(query, (
                                league_id,
                                team_id,
                                season,
                                standing.get("rank"),
                                standing.get("points"),
                                standing.get("all", {}).get("played"),
                                standing.get("all", {}).get("win"),
                                standing.get("all", {}).get("draw"),
                                standing.get("all", {}).get("lose"),
                                standing.get("all", {}).get("goals", {}).get("for"),
                                standing.get("all", {}).get("goals", {}).get("against"),
                                standing.get("goalsDiff"),
                                standing.get("form")
                            ))
            
            self.db_conn.commit()
            logger.info(f"Successfully processed standings for league {league_id}, season {season}")
            
        except (APIRequestError, DatabaseError) as err:
            logger.error(f"Error fetching standings: {err}")
            self.db_conn.rollback()
            raise
    
    def run_full_update(self, season=None):
        """Run a full update of all data."""
        try:
            # Connect to database
            self.connect_to_database()
            
            # If season is not provided, use current year
            if not season:
                season = datetime.now().year
            
            # Fetch countries
            self.fetch_countries()
            
            # Fetch leagues
            self.fetch_leagues(season=season)
            
            # Get all leagues
            self.db_cursor.execute("SELECT league_id FROM leagues")
            leagues = self.db_cursor.fetchall()
            
            # For each league, fetch teams, fixtures, and standings
            for league in leagues:
                league_id = league["league_id"]
                
                # Fetch teams
                self.fetch_teams(league_id, season)
                
                # Fetch fixtures
                self.fetch_fixtures(league_id, season)
                
                # Fetch standings
                self.fetch_standings(league_id, season)
                
                # Add a small delay to avoid hitting rate limits
                time.sleep(1)
            
            logger.info("Full update completed successfully")
            
        except Exception as err:
            logger.error(f"Error during full update: {err}")
            raise
        finally:
            self.close_database_connection()
    
    def update_live_fixtures(self):
        """Update only live fixtures."""
        try:
            # Connect to database
            self.connect_to_database()
            
            # Fetch live fixtures from API
            live_fixtures = self.make_api_request("fixtures", {"live": "all"})
            
            for fixture_data in live_fixtures:
                fixture = fixture_data["fixture"]
                league = fixture_data["league"]
                teams = fixture_data["teams"]
                goals = fixture_data["goals"]
                score = fixture_data["score"]
                
                # Get league_id
                self.db_cursor.execute(
                    "SELECT league_id FROM leagues WHERE api_league_id = %s", 
                    (league["id"],)
                )
                league_result = self.db_cursor.fetchone()
                
                if not league_result:
                    logger.warning(f"League with API ID {league['id']} not found in database")
                    continue
                
                league_id = league_result["league_id"]
                
                # Get home and away team IDs
                home_team_id = None
                away_team_id = None
                
                # Get home team
                self.db_cursor.execute(
                    "SELECT team_id FROM teams WHERE api_team_id = %s", 
                    (teams["home"]["id"],)
                )
                home_result = self.db_cursor.fetchone()
                
                if home_result:
                    home_team_id = home_result["team_id"]
                
                # Get away team
                self.db_cursor.execute(
                    "SELECT team_id FROM teams WHERE api_team_id = %s", 
                    (teams["away"]["id"],)
                )
                away_result = self.db_cursor.fetchone()
                
                if away_result:
                    away_team_id = away_result["team_id"]
                
                # Skip if we can't find both teams
                if not home_team_id or not away_team_id:
                    logger.warning(f"Skipping fixture {fixture['id']} - missing team IDs")
                    continue
                
                # Check if fixture already exists
                self.db_cursor.execute(
                    "SELECT fixture_id FROM fixtures WHERE api_fixture_id = %s", 
                    (fixture["id"],)
                )
                result = self.db_cursor.fetchone()
                
                fixture_date = None
                if fixture.get("date"):
                    try:
                        fixture_date = datetime.fromisoformat(fixture["date"].replace("Z", "+00:00"))
                    except (ValueError, TypeError):
                        logger.warning(f"Invalid date format for fixture {fixture['id']}: {fixture.get('date')}")
                
                if result:
                    # Update existing fixture
                    query = """
                    UPDATE fixtures 
                    SET status = %s, home_score = %s, away_score = %s,
                        halftime_home_score = %s, halftime_away_score = %s,
                        fulltime_home_score = %s, fulltime_away_score = %s,
                        extratime_home_score = %s, extratime_away_score = %s,
                        penalty_home_score = %s, penalty_away_score = %s,
                        updated_at = NOW() 
                    WHERE fixture_id = %s
                    """
                    self.db_cursor.execute(query, (
                        fixture.get("status", {}).get("short"),
                        goals.get("home"),
                        goals.get("away"),
                        score.get("halftime", {}).get("home"),
                        score.get("halftime", {}).get("away"),
                        score.get("fulltime", {}).get("home"),
                        score.get("fulltime", {}).get("away"),
                        score.get("extratime", {}).get("home"),
                        score.get("extratime", {}).get("away"),
                        score.get("penalty", {}).get("home"),
                        score.get("penalty", {}).get("away"),
                        result["fixture_id"]
                    ))
                else:
                    # Insert new fixture
                    query = """
                    INSERT INTO fixtures 
                    (api_fixture_id, league_id, home_team_id, away_team_id,
                     fixture_date, status, round, season, venue, referee,
                     home_score, away_score, halftime_home_score, halftime_away_score,
                     fulltime_home_score, fulltime_away_score, extratime_home_score,
                     extratime_away_score, penalty_home_score, penalty_away_score) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    self.db_cursor.execute(query, (
                        fixture["id"],
                        league_id,
                        home_team_id,
                        away_team_id,
                        fixture_date,
                        fixture.get("status", {}).get("short"),
                        league.get("round"),
                        league.get("season"),
                        fixture.get("venue", {}).get("name"),
                        fixture.get("referee"),
                        goals.get("home"),
                        goals.get("away"),
                        score.get("halftime", {}).get("home"),
                        score.get("halftime", {}).get("away"),
                        score.get("fulltime", {}).get("home"),
                        score.get("fulltime", {}).get("away"),
                        score.get("extratime", {}).get("home"),
                        score.get("extratime", {}).get("away"),
                        score.get("penalty", {}).get("home"),
                        score.get("penalty", {}).get("away")
                    ))
            
            self.db_conn.commit()
            logger.info(f"Successfully updated {len(live_fixtures)} live fixtures")
            
        except Exception as err:
            logger.error(f"Error updating live fixtures: {err}")
            raise
        finally:
            self.close_database_connection()

def main():
    """Main function to run the data fetcher."""
    parser = argparse.ArgumentParser(description="Fetch sports data from API-Sports")
    parser.add_argument("--full", action="store_true", help="Run a full update of all data")
    parser.add_argument("--live", action="store_true", help="Update only live fixtures")
    parser.add_argument("--season", type=int, help="Season to fetch data for (default: current year)")
    parser.add_argument("--country", type=str, help="Country to fetch leagues for")
    parser.add_argument("--league", type=int, help="League ID to fetch data for")
    
    args = parser.parse_args()
    
    fetcher = SportsDataFetcher()
    
    try:
        if args.live:
            fetcher.update_live_fixtures()
        elif args.full:
            fetcher.run_full_update(args.season)
        elif args.league and args.season:
            fetcher.connect_to_database()
            fetcher.fetch_teams(args.league, args.season)
            fetcher.fetch_fixtures(args.league, args.season)
            fetcher.fetch_standings(args.league, args.season)
            fetcher.close_database_connection()
        elif args.country:
            fetcher.connect_to_database()
            fetcher.fetch_leagues(country=args.country, season=args.season)
            fetcher.close_database_connection()
        else:
            logger.error("No action specified. Use --full, --live, or specify a league and season.")
    except Exception as err:
        logger.error(f"Error in main function: {err}")
        sys.exit(1)

if __name__ == "__main__":
    import argparse
    main()
