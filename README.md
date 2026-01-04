#!/usr/bin/env python3
"""
Sports Data Fetcher - README

This file contains instructions for setting up and using the sports data integration.
"""

# Sports Data Integration Project

## Overview

This project integrates live sports data from API-Sports into your database and application. It includes scripts for:

1. Setting up the database schema
2. Configuring API access
3. Fetching and storing sports data
4. Manually updating data at regular intervals
5. Testing API connectivity

## Setup Instructions

### 1. Install Required Dependencies

```bash
pip install mysql-connector-python requests python-dotenv
```

### 2. Configure API Access

Run the configuration script to set up your API key and database credentials:

```bash
python config_setup.py
```

You will need:
- Your API-Sports API key
- Database host, username, password, and database name

### 3. Set Up the Database

Run the database setup script to create the necessary database and tables:

```bash
python setup_database.py
```

### 4. Test API Connectivity

Verify that your API key works and you can fetch data:

```bash
python test_api.py
```

## Usage

### Fetching Data

The main script `sports_data_fetcher.py` provides several options for fetching data:

```bash
# Fetch all data (full update)
python sports_data_fetcher.py --full

# Update only live fixtures
python sports_data_fetcher.py --live

# Fetch data for a specific league and season
python sports_data_fetcher.py --league 39 --season 2023

# Fetch leagues for a specific country
python sports_data_fetcher.py --country "England"
```

### Regular Updates

Since scheduled tasks are not available, you can use the manual update script to fetch data at regular intervals:

```bash
# Update live fixtures every 60 seconds
python manual_update.py --type live --interval 60

# Run a full update once per day (86400 seconds)
python manual_update.py --type full --interval 86400

# Run live updates every minute for 60 iterations (1 hour)
python manual_update.py --type live --interval 60 --iterations 60
```

## Data Structure

The database schema includes tables for:

- Countries
- Leagues
- Teams
- Players
- Fixtures (matches)
- Events (goals, cards, etc.)
- Statistics
- Standings

See `database_schema_documentation.md` for detailed information about the database structure.

## API Usage

This project uses API-Sports for fetching live sports data. The free tier includes:
- 100 requests per day per API
- Access to multiple sports APIs
- Real-time updates every 15 seconds

For production use, consider upgrading to a paid plan based on your needs.

## Troubleshooting

- Check `sports_data_fetcher.log` for detailed error messages
- Verify your API key is correct in the `.env` file
- Ensure your database credentials are correct
- Check your API request limits in the API-Sports dashboard

## Next Steps

1. Implement a user interface for visualizing the sports data
2. Add user authentication for accessing the data
3. Implement search and filtering functionality
4. Add payment processing for premium features
