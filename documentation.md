# Sports Data Integration Project Documentation

## Overview

This project integrates real-time sports data from API-Sports into a database and web application. It provides:

1. **Data Collection**: Scripts to fetch and store sports data from API-Sports
2. **Database Integration**: Comprehensive schema for storing sports data
3. **Web Interface**: Next.js application for visualizing and managing sports data
4. **Search Functionality**: Ability to search for leagues, teams, and fixtures
5. **AI Chatbot**: Intelligent assistant to help users find sports information
6. **Payment Testing**: System to test subscription payments with test credit cards

## System Architecture

The system consists of three main components:

1. **Data Fetching Layer**: Python scripts that connect to API-Sports, fetch data, and store it in the database
2. **Database Layer**: SQL database with tables for countries, leagues, teams, fixtures, etc.
3. **UI Layer**: Next.js web application with components for displaying and interacting with sports data

## Setup Instructions

### 1. Data Fetching Setup

1. Navigate to the data fetching directory:
   ```bash
   cd /home/ubuntu/sports_data_project
   ```

2. Install required Python dependencies:
   ```bash
   pip install mysql-connector-python requests python-dotenv
   ```

3. Configure API access:
   ```bash
   python config_setup.py
   ```
   - You'll need to enter your API-Sports API key and database credentials

4. Set up the database:
   ```bash
   python setup_database.py
   ```

5. Test API connectivity:
   ```bash
   python test_api.py
   ```

### 2. Web UI Setup

1. Navigate to the UI directory:
   ```bash
   cd /home/ubuntu/sports_data_project/ui
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Set up the database for the UI:
   ```bash
   wrangler d1 execute DB --local --file=migrations/0001_initial.sql
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at http://localhost:3000

## Data Fetching

### Main Script: `sports_data_fetcher.py`

This script fetches data from API-Sports and populates the database. It includes:

- **Error handling**: Proper handling of API errors and rate limiting
- **Logging**: Comprehensive logging of operations and errors
- **Database operations**: Methods for inserting and updating data
- **Command-line interface**: Options for different types of updates

### Usage Examples

```bash
# Fetch all data (full update)
python sports_data_fetcher.py --full

# Update only live fixtures
python sports_data_fetcher.py --live

# Fetch data for a specific league and season
python sports_data_fetcher.py --league 39 --season 2023
```

### Manual Updates

Since scheduled tasks are not available, use the manual update script:

```bash
# Update live fixtures every 60 seconds
python manual_update.py --type live --interval 60

# Run a full update once per day (86400 seconds)
python manual_update.py --type full --interval 86400
```

## Database Schema

The database schema includes tables for:

1. **Countries**: Information about countries
2. **Leagues**: Sports leagues and competitions
3. **Teams**: Teams participating in leagues
4. **Players**: Player information
5. **Fixtures**: Matches and events
6. **Events**: Goals, cards, and other match events
7. **Statistics**: Match statistics
8. **Standings**: League standings
9. **Users**: User accounts and authentication
10. **Payment Transactions**: Subscription payment records

See `database_schema_documentation.md` for detailed information about each table.

## Web UI Components

### 1. Main Layout

The main layout includes:
- Navigation header with links to main sections
- Footer with site information
- Integrated AI chatbot

### 2. Homepage

The homepage showcases:
- Hero section with call-to-action buttons
- Features overview
- Sports coverage information
- Subscription promotion

### 3. Live Scores Page

Displays real-time scores for ongoing matches across different sports.

### 4. Search Functionality

Allows users to search for:
- Leagues
- Teams
- Fixtures (matches)

Results are displayed in categorized tabs.

### 5. Payment Testing

Includes:
- Subscription tier selection
- Test credit card information
- Payment form with validation
- Success/failure handling

### 6. AI Chatbot

An intelligent assistant that:
- Helps users find sports information
- Answers questions about the platform
- Provides guidance on using features
- Assists with subscription information

## API Integration

### API-Sports

This project uses API-Sports for fetching live sports data:

- **Free Tier**: 100 requests per day per API
- **Real-time Updates**: Every 15 seconds
- **Multiple Sports**: Football, Basketball, Baseball, etc.
- **Comprehensive Data**: Teams, players, fixtures, statistics, etc.

### Authentication

API requests require an API key in the headers:

```
x-apisports-key: YOUR_API_KEY
```

## Payment Testing

The payment testing system allows testing with different credit card scenarios:

1. **Valid Card (Approved)**:
   - Number: 4242 4242 4242 4242
   - Expiry: 12/25
   - CVC: 123

2. **Declined Card**:
   - Number: 4000 0000 0000 0002
   - Expiry: 12/25
   - CVC: 123

3. **Insufficient Funds Card**:
   - Number: 4000 0000 0000 9995
   - Expiry: 12/25
   - CVC: 123

4. **Expired Card**:
   - Number: 4000 0000 0000 0069
   - Expiry: 12/20
   - CVC: 123

## Subscription Tiers

The platform offers three subscription tiers:

1. **Free**:
   - Access to basic sports data
   - Limited to 5 searches per day
   - View live scores for major leagues
   - Basic statistics

2. **Basic ($9.99/month)**:
   - All Free features
   - Unlimited searches
   - Live scores for all leagues
   - Detailed match statistics
   - Team and player profiles

3. **Premium ($19.99/month)**:
   - All Basic features
   - Historical data access
   - Advanced statistics and analytics
   - Personalized notifications
   - No advertisements
   - Priority customer support

## Future Enhancements

Potential future enhancements include:

1. **Mobile App**: Native mobile applications for iOS and Android
2. **Personalized Alerts**: Notifications for favorite teams and matches
3. **Advanced Analytics**: Statistical analysis and predictions
4. **Social Features**: Sharing and commenting functionality
5. **API Access**: Providing API access to subscribers
6. **More Sports**: Adding additional sports and leagues

## Troubleshooting

### Common Issues

1. **API Rate Limiting**:
   - The free tier is limited to 100 requests per day
   - Use the `--interval` parameter in manual_update.py to space out requests

2. **Database Connection Issues**:
   - Verify database credentials in .env file
   - Ensure MySQL server is running

3. **UI Development Issues**:
   - Clear .wrangler/state/v3 directory and re-execute SQL file
   - Check for JavaScript console errors

### Logs

- Check `sports_data_fetcher.log` for data fetching errors
- Check `manual_update.log` for update process errors
- Browser console for UI errors

## Contact and Support

For questions or support, please contact:
- Email: support@sportsdatahub.com
- Website: https://sportsdatahub.com/contact
