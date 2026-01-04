#!/usr/bin/env python3
"""
Sports Data Fetcher - Test Script

This script tests the connection to the API-Sports API and verifies that data can be fetched.
"""

import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Configuration
API_KEY = os.getenv("API_SPORTS_KEY")
API_BASE_URL = "https://v3.football.api-sports.io"
API_HEADERS = {
    "x-apisports-key": API_KEY,
}

def test_api_connection():
    """Test the connection to the API-Sports API."""
    print("Sports Data Fetcher - API Connection Test")
    print("=======================================")
    
    if not API_KEY:
        print("Error: API key not found. Please run config_setup.py first.")
        sys.exit(1)
    
    print("Testing API connection...")
    
    try:
        # Test with a simple endpoint
        url = f"{API_BASE_URL}/status"
        response = requests.get(url, headers=API_HEADERS)
        
        # Check response
        if response.status_code == 200:
            data = response.json()
            print("\nAPI connection successful!")
            print("\nAPI Status:")
            print(f"  Account: {data.get('response', {}).get('account', {}).get('name', 'N/A')}")
            print(f"  Subscription: {data.get('response', {}).get('subscription', {}).get('plan', 'N/A')}")
            print(f"  Requests remaining: {data.get('response', {}).get('requests', {}).get('current', 'N/A')}/{data.get('response', {}).get('requests', {}).get('limit_day', 'N/A')}")
            
            # Test fetching some actual data
            print("\nTesting data retrieval...")
            
            # Fetch countries
            url = f"{API_BASE_URL}/countries"
            response = requests.get(url, headers=API_HEADERS)
            
            if response.status_code == 200:
                data = response.json()
                countries = data.get("response", [])
                print(f"  Successfully retrieved {len(countries)} countries")
                
                # Print first 3 countries as a sample
                print("\nSample countries:")
                for i, country in enumerate(countries[:3]):
                    print(f"  {i+1}. {country.get('name')} ({country.get('code')})")
                
                print("\nAPI tests completed successfully!")
            else:
                print(f"\nError fetching countries: {response.status_code}")
                print(response.text)
        else:
            print(f"\nAPI connection failed: {response.status_code}")
            print(response.text)
    
    except requests.exceptions.RequestException as err:
        print(f"\nError connecting to API: {err}")
        sys.exit(1)

if __name__ == "__main__":
    test_api_connection()
