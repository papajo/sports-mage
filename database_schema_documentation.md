# Database Schema Documentation

This document describes the database schema designed for the sports data integration project using API-Sports.

## Overview

The database schema is designed to store comprehensive sports data retrieved from API-Sports, with a focus on football/soccer data initially but structured to be adaptable for other sports. The schema includes tables for countries, leagues, teams, players, fixtures (matches), events, statistics, and standings.

## Tables Structure

### Countries
Stores information about countries, including:
- Country ID (Primary Key)
- Name
- Country code (2-6 characters)
- Flag URL
- Timestamps for creation and updates

### Leagues
Stores information about sports leagues and competitions:
- League ID (Primary Key)
- API League ID (from API-Sports)
- Name
- Type (League or Cup)
- Country ID (Foreign Key)
- Logo URL
- Season start and end dates
- Current season
- Timestamps

### Teams
Stores information about sports teams:
- Team ID (Primary Key)
- API Team ID (from API-Sports)
- Name
- Country ID (Foreign Key)
- Logo URL
- Founded year
- Venue details (name, capacity, city)
- Timestamps

### League_Teams
Junction table for the many-to-many relationship between leagues and teams:
- League Team ID (Primary Key)
- League ID (Foreign Key)
- Team ID (Foreign Key)
- Season
- Timestamp

### Players
Stores information about players:
- Player ID (Primary Key)
- API Player ID (from API-Sports)
- Name
- First name and last name
- Date of birth
- Nationality
- Height and weight
- Photo URL
- Timestamps

### Team_Players
Junction table for the many-to-many relationship between teams and players:
- Team Player ID (Primary Key)
- Team ID (Foreign Key)
- Player ID (Foreign Key)
- Jersey number
- Position
- Captain status
- Season
- Timestamps

### Fixtures
Stores information about matches/fixtures:
- Fixture ID (Primary Key)
- API Fixture ID (from API-Sports)
- League ID (Foreign Key)
- Home and Away Team IDs (Foreign Keys)
- Fixture date and time
- Status (Not Started, Live, Full-Time, etc.)
- Round and season
- Venue and referee
- Scores (home/away, halftime, fulltime, extratime, penalty)
- Timestamps

### Events
Stores match events such as goals, cards, substitutions:
- Event ID (Primary Key)
- Fixture ID (Foreign Key)
- Team ID (Foreign Key)
- Player ID and Assist Player ID (Foreign Keys)
- Event type and detail
- Event time and extra time
- Comments
- Timestamp

### Statistics
Stores team statistics for matches:
- Stat ID (Primary Key)
- Fixture ID (Foreign Key)
- Team ID (Foreign Key)
- Statistic type (Shots on Goal, Possession, etc.)
- Statistic value
- Timestamp

### Player_Statistics
Stores individual player statistics for matches:
- Player Stat ID (Primary Key)
- Fixture ID (Foreign Key)
- Player ID (Foreign Key)
- Team ID (Foreign Key)
- Minutes played
- Rating
- Various performance metrics (shots, goals, assists, passes, cards)
- Timestamp

### Standings
Stores league standings/tables:
- Standing ID (Primary Key)
- League ID (Foreign Key)
- Team ID (Foreign Key)
- Season
- Rank and points
- Match results (played, win, draw, lose)
- Goals (for, against, difference)
- Form (last 5 matches)
- Timestamps

### API_Request_Log
Tracks API usage for monitoring and optimization:
- Log ID (Primary Key)
- Endpoint
- Parameters
- Response status and time
- Timestamp

## Indexes

The schema includes several indexes for performance optimization:
- Indexes on foreign keys for efficient joins
- Indexes on frequently queried fields like fixture dates
- Composite indexes for common query patterns

## Relationships

The schema implements the following relationships:
- One-to-many: Countries to Leagues, Countries to Teams
- Many-to-many: Leagues to Teams, Teams to Players
- One-to-many: Leagues to Fixtures, Teams to Fixtures
- One-to-many: Fixtures to Events, Fixtures to Statistics

This schema provides a solid foundation for storing and querying sports data from API-Sports, with flexibility to expand for additional sports and data types as needed.
