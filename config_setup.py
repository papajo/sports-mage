#!/usr/bin/env python3
"""
Sports Data Fetcher - Configuration Script

This script creates a .env file with configuration settings for the sports data fetcher.
"""

import os
import sys
import getpass

def create_env_file():
    """Create a .env file with configuration settings."""
    print("Sports Data Fetcher - Configuration Setup")
    print("========================================")
    print("This script will create a .env file with configuration settings.")
    print("You will need your API-Sports API key and database credentials.")
    print()
    
    # Get API key
    api_key = input("Enter your API-Sports API key: ")
    
    # Get database credentials
    db_host = input("Enter database host [localhost]: ") or "localhost"
    db_user = input("Enter database username [root]: ") or "root"
    db_password = getpass.getpass("Enter database password: ")
    db_name = input("Enter database name [sports_data]: ") or "sports_data"
    
    # Create .env file
    env_content = f"""# API-Sports Configuration
API_SPORTS_KEY={api_key}

# Database Configuration
DB_HOST={db_host}
DB_USER={db_user}
DB_PASSWORD={db_password}
DB_NAME={db_name}
"""
    
    # Write to .env file
    with open(".env", "w") as f:
        f.write(env_content)
    
    print("\n.env file created successfully!")
    print("You can now run the sports_data_fetcher.py script.")

if __name__ == "__main__":
    create_env_file()
