import os
import requests
import json
import logging
from datetime import datetime
import time

# Configure logging
logging.basicConfig(
    filename='sportradar_data_fetcher.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('sportradar_data_fetcher')

class SportRadarAPI:
    """Base class for SportRadar API integration"""
    
    def __init__(self, api_key=None, config_file='.env.sportradar'):
        """Initialize the SportRadar API client
        
        Args:
            api_key (str, optional): API key for SportRadar. If not provided, will try to load from config file
            config_file (str, optional): Path to configuration file containing API keys
        """
        self.api_key = api_key
        self.base_url = "https://api.sportradar.com"
        self.headers = {"Content-Type": "application/json"}
        self.rate_limit_remaining = 1000  # Default value, will be updated with API responses
        self.rate_limit_reset = 0
        
        if not api_key:
            self._load_config(config_file)
            
        if self.api_key:
            self.headers["api_key"] = self.api_key
        else:
            logger.error("No API key provided or found in config file")
            raise ValueError("API key is required")
    
    def _load_config(self, config_file):
        """Load configuration from file
        
        Args:
            config_file (str): Path to configuration file
        """
        try:
            if os.path.exists(config_file):
                with open(config_file, 'r') as f:
                    for line in f:
                        if '=' in line:
                            key, value = line.strip().split('=', 1)
                            if key == 'SPORTRADAR_API_KEY':
                                self.api_key = value
                                logger.info("Loaded API key from config file")
            else:
                logger.warning(f"Config file {config_file} not found")
        except Exception as e:
            logger.error(f"Error loading config: {str(e)}")
    
    def _handle_rate_limit(self):
        """Handle rate limiting by waiting if necessary"""
        if self.rate_limit_remaining <= 1:
            current_time = time.time()
            if current_time < self.rate_limit_reset:
                wait_time = self.rate_limit_reset - current_time + 1  # Add 1 second buffer
                logger.info(f"Rate limit reached. Waiting for {wait_time:.2f} seconds")
                time.sleep(wait_time)
    
    def _update_rate_limit_info(self, response):
        """Update rate limit information from response headers
        
        Args:
            response (requests.Response): API response
        """
        if 'X-Rate-Limit-Remaining' in response.headers:
            self.rate_limit_remaining = int(response.headers['X-Rate-Limit-Remaining'])
        
        if 'X-Rate-Limit-Reset' in response.headers:
            self.rate_limit_reset = int(response.headers['X-Rate-Limit-Reset'])
    
    def _make_request(self, endpoint, params=None):
        """Make a request to the SportRadar API
        
        Args:
            endpoint (str): API endpoint
            params (dict, optional): Query parameters
            
        Returns:
            dict: JSON response from the API
        """
        url = f"{self.base_url}/{endpoint}"
        self._handle_rate_limit()
        
        try:
            response = requests.get(url, headers=self.headers, params=params)
            self._update_rate_limit_info(response)
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"API request failed: {response.status_code} - {response.text}")
                response.raise_for_status()
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {str(e)}")
            raise
        
    def test_connection(self):
        """Test the API connection
        
        Returns:
            bool: True if connection is successful
        """
        try:
            # This will be implemented by subclasses with an appropriate endpoint
            return False
        except Exception as e:
            logger.error(f"Connection test failed: {str(e)}")
            return False


class TennisAPI(SportRadarAPI):
    """SportRadar Tennis API client"""
    
    def __init__(self, api_key=None, config_file='.env.sportradar'):
        """Initialize the Tennis API client"""
        super().__init__(api_key, config_file)
        self.base_url = "https://api.sportradar.com/tennis/v3"
    
    def test_connection(self):
        """Test the Tennis API connection"""
        try:
            result = self._make_request("competitions")
            return "competitions" in result
        except Exception as e:
            logger.error(f"Tennis API connection test failed: {str(e)}")
            return False
    
    def get_daily_summaries(self, date=None):
        """Get daily summaries for a specific date
        
        Args:
            date (str, optional): Date in YYYY-MM-DD format. Defaults to today.
            
        Returns:
            dict: Daily summaries data
        """
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")
        
        endpoint = f"daily_summaries/{date}"
        return self._make_request(endpoint)
    
    def get_live_summaries(self):
        """Get live summaries for all currently live matches
        
        Returns:
            dict: Live summaries data
        """
        endpoint = "live_summaries"
        return self._make_request(endpoint)
    
    def get_competitor_profile(self, competitor_id):
        """Get profile information for a specific competitor
        
        Args:
            competitor_id (str): Competitor ID
            
        Returns:
            dict: Competitor profile data
        """
        endpoint = f"competitors/{competitor_id}/profile"
        return self._make_request(endpoint)
    
    def get_sport_event_summary(self, event_id):
        """Get summary information for a specific sport event
        
        Args:
            event_id (str): Sport event ID
            
        Returns:
            dict: Sport event summary data
        """
        endpoint = f"sport_events/{event_id}/summary"
        return self._make_request(endpoint)
    
    def get_season_summaries(self, season_id):
        """Get summaries for all matches in a season
        
        Args:
            season_id (str): Season ID
            
        Returns:
            dict: Season summaries data
        """
        endpoint = f"seasons/{season_id}/summaries"
        return self._make_request(endpoint)


class CricketAPI(SportRadarAPI):
    """SportRadar Cricket API client"""
    
    def __init__(self, api_key=None, config_file='.env.sportradar'):
        """Initialize the Cricket API client"""
        super().__init__(api_key, config_file)
        self.base_url = "https://api.sportradar.com/cricket/v2"
    
    def test_connection(self):
        """Test the Cricket API connection"""
        try:
            result = self._make_request("tournament_list")
            return "tournaments" in result
        except Exception as e:
            logger.error(f"Cricket API connection test failed: {str(e)}")
            return False
    
    def get_daily_live_schedule(self, date=None):
        """Get daily live schedule for a specific date
        
        Args:
            date (str, optional): Date in YYYY-MM-DD format. Defaults to today.
            
        Returns:
            dict: Daily live schedule data
        """
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")
        
        endpoint = f"daily_live_schedule/{date}"
        return self._make_request(endpoint)
    
    def get_match_summary(self, match_id):
        """Get summary information for a specific match
        
        Args:
            match_id (str): Match ID
            
        Returns:
            dict: Match summary data
        """
        endpoint = f"match_summary/{match_id}"
        return self._make_request(endpoint)
    
    def get_match_timeline(self, match_id):
        """Get timeline information for a specific match
        
        Args:
            match_id (str): Match ID
            
        Returns:
            dict: Match timeline data
        """
        endpoint = f"match_timeline/{match_id}"
        return self._make_request(endpoint)
    
    def get_player_profile(self, player_id):
        """Get profile information for a specific player
        
        Args:
            player_id (str): Player ID
            
        Returns:
            dict: Player profile data
        """
        endpoint = f"player_profile/{player_id}"
        return self._make_request(endpoint)
    
    def get_tournament_info(self, tournament_id):
        """Get information for a specific tournament
        
        Args:
            tournament_id (str): Tournament ID
            
        Returns:
            dict: Tournament information data
        """
        endpoint = f"tournament_info/{tournament_id}"
        return self._make_request(endpoint)
    
    def get_tournament_standings(self, tournament_id):
        """Get standings for a specific tournament
        
        Args:
            tournament_id (str): Tournament ID
            
        Returns:
            dict: Tournament standings data
        """
        endpoint = f"tournament_standings/{tournament_id}"
        return self._make_request(endpoint)


if __name__ == "__main__":
    # Example usage
    try:
        # Test Tennis API
        tennis_api = TennisAPI()
        if tennis_api.test_connection():
            print("Tennis API connection successful")
            daily_summaries = tennis_api.get_daily_summaries()
            print(f"Retrieved {len(daily_summaries.get('summaries', []))} tennis daily summaries")
        else:
            print("Tennis API connection failed")
        
        # Test Cricket API
        cricket_api = CricketAPI()
        if cricket_api.test_connection():
            print("Cricket API connection successful")
            daily_schedule = cricket_api.get_daily_live_schedule()
            print(f"Retrieved {len(daily_schedule.get('sport_events', []))} cricket daily live events")
        else:
            print("Cricket API connection failed")
            
    except Exception as e:
        print(f"Error: {str(e)}")
        logger.error(f"Error in main execution: {str(e)}")
