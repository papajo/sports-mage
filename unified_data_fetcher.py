import os
import sys
import logging
import time
from datetime import datetime
from typing import Dict, List, Any, Optional, Union

# Import both API clients
from sports_data_fetcher import APISportsClient
from sportradar_data_fetcher import TennisAPI, CricketAPI

# Configure logging
logging.basicConfig(
    filename='unified_data_fetcher.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('unified_data_fetcher')

class UnifiedSportsDataFetcher:
    """
    A unified class that integrates both API-Sports and SportRadar APIs
    to provide comprehensive sports data including Tennis and Cricket
    """
    
    def __init__(self, config_file: str = '.env.sports'):
        """
        Initialize the unified sports data fetcher
        
        Args:
            config_file (str): Path to configuration file containing API keys
        """
        self.config_file = config_file
        self.api_sports_client = None
        self.tennis_api = None
        self.cricket_api = None
        
        # Load configuration and initialize API clients
        self._load_config()
        
    def _load_config(self) -> None:
        """Load configuration from file and initialize API clients"""
        try:
            api_sports_key = None
            sportradar_key = None
            
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r') as f:
                    for line in f:
                        if '=' in line:
                            key, value = line.strip().split('=', 1)
                            if key == 'API_SPORTS_KEY':
                                api_sports_key = value
                            elif key == 'SPORTRADAR_API_KEY':
                                sportradar_key = value
            
            # Initialize API clients
            if api_sports_key:
                self.api_sports_client = APISportsClient(api_key=api_sports_key)
                logger.info("Initialized API-Sports client")
            else:
                logger.warning("API-Sports key not found in config file")
            
            if sportradar_key:
                self.tennis_api = TennisAPI(api_key=sportradar_key)
                self.cricket_api = CricketAPI(api_key=sportradar_key)
                logger.info("Initialized SportRadar Tennis and Cricket clients")
            else:
                logger.warning("SportRadar API key not found in config file")
                
        except Exception as e:
            logger.error(f"Error loading configuration: {str(e)}")
            raise
    
    def test_connections(self) -> Dict[str, bool]:
        """
        Test connections to all API providers
        
        Returns:
            Dict[str, bool]: Connection status for each API
        """
        results = {}
        
        if self.api_sports_client:
            try:
                results['api_sports'] = self.api_sports_client.test_connection()
            except Exception as e:
                logger.error(f"API-Sports connection test failed: {str(e)}")
                results['api_sports'] = False
        else:
            results['api_sports'] = False
        
        if self.tennis_api:
            try:
                results['tennis'] = self.tennis_api.test_connection()
            except Exception as e:
                logger.error(f"Tennis API connection test failed: {str(e)}")
                results['tennis'] = False
        else:
            results['tennis'] = False
        
        if self.cricket_api:
            try:
                results['cricket'] = self.cricket_api.test_connection()
            except Exception as e:
                logger.error(f"Cricket API connection test failed: {str(e)}")
                results['cricket'] = False
        else:
            results['cricket'] = False
        
        return results
    
    # API-Sports methods
    
    def get_countries(self) -> List[Dict[str, Any]]:
        """
        Get list of countries from API-Sports
        
        Returns:
            List[Dict[str, Any]]: List of countries
        """
        if not self.api_sports_client:
            logger.error("API-Sports client not initialized")
            return []
        
        try:
            return self.api_sports_client.get_countries()
        except Exception as e:
            logger.error(f"Error fetching countries: {str(e)}")
            return []
    
    def get_leagues(self, country_id: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Get list of leagues from API-Sports
        
        Args:
            country_id (int, optional): Filter leagues by country ID
            
        Returns:
            List[Dict[str, Any]]: List of leagues
        """
        if not self.api_sports_client:
            logger.error("API-Sports client not initialized")
            return []
        
        try:
            return self.api_sports_client.get_leagues(country_id)
        except Exception as e:
            logger.error(f"Error fetching leagues: {str(e)}")
            return []
    
    def get_teams(self, league_id: int) -> List[Dict[str, Any]]:
        """
        Get list of teams for a league from API-Sports
        
        Args:
            league_id (int): League ID
            
        Returns:
            List[Dict[str, Any]]: List of teams
        """
        if not self.api_sports_client:
            logger.error("API-Sports client not initialized")
            return []
        
        try:
            return self.api_sports_client.get_teams(league_id)
        except Exception as e:
            logger.error(f"Error fetching teams: {str(e)}")
            return []
    
    def get_fixtures(self, date: Optional[str] = None, league_id: Optional[int] = None, 
                    team_id: Optional[int] = None, live: bool = False) -> List[Dict[str, Any]]:
        """
        Get fixtures from API-Sports
        
        Args:
            date (str, optional): Date in YYYY-MM-DD format
            league_id (int, optional): League ID
            team_id (int, optional): Team ID
            live (bool, optional): Whether to get live fixtures
            
        Returns:
            List[Dict[str, Any]]: List of fixtures
        """
        if not self.api_sports_client:
            logger.error("API-Sports client not initialized")
            return []
        
        try:
            return self.api_sports_client.get_fixtures(date, league_id, team_id, live)
        except Exception as e:
            logger.error(f"Error fetching fixtures: {str(e)}")
            return []
    
    # Tennis API methods
    
    def get_tennis_daily_summaries(self, date: Optional[str] = None) -> Dict[str, Any]:
        """
        Get tennis daily summaries from SportRadar
        
        Args:
            date (str, optional): Date in YYYY-MM-DD format
            
        Returns:
            Dict[str, Any]: Tennis daily summaries
        """
        if not self.tennis_api:
            logger.error("Tennis API client not initialized")
            return {}
        
        try:
            return self.tennis_api.get_daily_summaries(date)
        except Exception as e:
            logger.error(f"Error fetching tennis daily summaries: {str(e)}")
            return {}
    
    def get_tennis_live_summaries(self) -> Dict[str, Any]:
        """
        Get tennis live summaries from SportRadar
        
        Returns:
            Dict[str, Any]: Tennis live summaries
        """
        if not self.tennis_api:
            logger.error("Tennis API client not initialized")
            return {}
        
        try:
            return self.tennis_api.get_live_summaries()
        except Exception as e:
            logger.error(f"Error fetching tennis live summaries: {str(e)}")
            return {}
    
    def get_tennis_competitor_profile(self, competitor_id: str) -> Dict[str, Any]:
        """
        Get tennis competitor profile from SportRadar
        
        Args:
            competitor_id (str): Competitor ID
            
        Returns:
            Dict[str, Any]: Tennis competitor profile
        """
        if not self.tennis_api:
            logger.error("Tennis API client not initialized")
            return {}
        
        try:
            return self.tennis_api.get_competitor_profile(competitor_id)
        except Exception as e:
            logger.error(f"Error fetching tennis competitor profile: {str(e)}")
            return {}
    
    # Cricket API methods
    
    def get_cricket_daily_live_schedule(self, date: Optional[str] = None) -> Dict[str, Any]:
        """
        Get cricket daily live schedule from SportRadar
        
        Args:
            date (str, optional): Date in YYYY-MM-DD format
            
        Returns:
            Dict[str, Any]: Cricket daily live schedule
        """
        if not self.cricket_api:
            logger.error("Cricket API client not initialized")
            return {}
        
        try:
            return self.cricket_api.get_daily_live_schedule(date)
        except Exception as e:
            logger.error(f"Error fetching cricket daily live schedule: {str(e)}")
            return {}
    
    def get_cricket_match_summary(self, match_id: str) -> Dict[str, Any]:
        """
        Get cricket match summary from SportRadar
        
        Args:
            match_id (str): Match ID
            
        Returns:
            Dict[str, Any]: Cricket match summary
        """
        if not self.cricket_api:
            logger.error("Cricket API client not initialized")
            return {}
        
        try:
            return self.cricket_api.get_match_summary(match_id)
        except Exception as e:
            logger.error(f"Error fetching cricket match summary: {str(e)}")
            return {}
    
    def get_cricket_tournament_info(self, tournament_id: str) -> Dict[str, Any]:
        """
        Get cricket tournament info from SportRadar
        
        Args:
            tournament_id (str): Tournament ID
            
        Returns:
            Dict[str, Any]: Cricket tournament info
        """
        if not self.cricket_api:
            logger.error("Cricket API client not initialized")
            return {}
        
        try:
            return self.cricket_api.get_tournament_info(tournament_id)
        except Exception as e:
            logger.error(f"Error fetching cricket tournament info: {str(e)}")
            return {}
    
    # Unified methods
    
    def get_all_live_matches(self) -> Dict[str, List[Dict[str, Any]]]:
        """
        Get all live matches from all supported sports
        
        Returns:
            Dict[str, List[Dict[str, Any]]]: Live matches grouped by sport
        """
        result = {
            'football': [],
            'basketball': [],
            'baseball': [],
            'hockey': [],
            'tennis': [],
            'cricket': []
        }
        
        # Get API-Sports live fixtures
        if self.api_sports_client:
            try:
                # Football
                football_fixtures = self.api_sports_client.get_fixtures(live=True)
                result['football'] = football_fixtures
                
                # Other sports from API-Sports would be added here
                # For example:
                # basketball_fixtures = self.api_sports_client.get_basketball_fixtures(live=True)
                # result['basketball'] = basketball_fixtures
                
            except Exception as e:
                logger.error(f"Error fetching API-Sports live fixtures: {str(e)}")
        
        # Get Tennis live matches
        if self.tennis_api:
            try:
                tennis_live = self.tennis_api.get_live_summaries()
                if 'summaries' in tennis_live:
                    result['tennis'] = tennis_live['summaries']
            except Exception as e:
                logger.error(f"Error fetching tennis live matches: {str(e)}")
        
        # Get Cricket live matches
        if self.cricket_api:
            try:
                cricket_live = self.cricket_api.get_daily_live_schedule()
                if 'sport_events' in cricket_live:
                    result['cricket'] = cricket_live['sport_events']
            except Exception as e:
                logger.error(f"Error fetching cricket live matches: {str(e)}")
        
        return result
    
    def get_upcoming_matches(self, days: int = 7) -> Dict[str, List[Dict[str, Any]]]:
        """
        Get upcoming matches for the next X days from all supported sports
        
        Args:
            days (int): Number of days to look ahead
            
        Returns:
            Dict[str, List[Dict[str, Any]]]: Upcoming matches grouped by sport
        """
        result = {
            'football': [],
            'basketball': [],
            'baseball': [],
            'hockey': [],
            'tennis': [],
            'cricket': []
        }
        
        # Get dates for the next X days
        dates = []
        for i in range(days):
            date = (datetime.now() + timedelta(days=i)).strftime("%Y-%m-%d")
            dates.append(date)
        
        # Get API-Sports fixtures for each date
        if self.api_sports_client:
            try:
                for date in dates:
                    football_fixtures = self.api_sports_client.get_fixtures(date=date)
                    result['football'].extend(football_fixtures)
                    
                    # Other sports from API-Sports would be added here
            except Exception as e:
                logger.error(f"Error fetching API-Sports upcoming fixtures: {str(e)}")
        
        # Get Tennis upcoming matches
        if self.tennis_api:
            try:
                for date in dates:
                    tennis_daily = self.tennis_api.get_daily_summaries(date=date)
                    if 'summaries' in tennis_daily:
                        result['tennis'].extend(tennis_daily['summaries'])
            except Exception as e:
                logger.error(f"Error fetching tennis upcoming matches: {str(e)}")
        
        # Get Cricket upcoming matches
        if self.cricket_api:
            try:
                for date in dates:
                    cricket_daily = self.cricket_api.get_daily_live_schedule(date=date)
                    if 'sport_events' in cricket_daily:
                        result['cricket'].extend(cricket_daily['sport_events'])
            except Exception as e:
                logger.error(f"Error fetching cricket upcoming matches: {str(e)}")
        
        return result


if __name__ == "__main__":
    # Example usage
    try:
        # Create unified fetcher
        fetcher = UnifiedSportsDataFetcher()
        
        # Test connections
        connection_status = fetcher.test_connections()
        print("Connection status:")
        for api, status in connection_status.items():
            print(f"  {api}: {'Connected' if status else 'Not connected'}")
        
        # Get live matches
        live_matches = fetcher.get_all_live_matches()
        print("\nLive matches:")
        for sport, matches in live_matches.items():
            print(f"  {sport}: {len(matches)} matches")
        
        # Get some specific data
        if fetcher.api_sports_client:
            countries = fetcher.get_countries()
            print(f"\nFound {len(countries)} countries from API-Sports")
        
        if fetcher.tennis_api:
            tennis_daily = fetcher.get_tennis_daily_summaries()
            print(f"\nFound {len(tennis_daily.get('summaries', []))} tennis matches for today")
        
        if fetcher.cricket_api:
            cricket_daily = fetcher.get_cricket_daily_live_schedule()
            print(f"\nFound {len(cricket_daily.get('sport_events', []))} cricket matches for today")
            
    except Exception as e:
        print(f"Error: {str(e)}")
        logger.error(f"Error in main execution: {str(e)}")
